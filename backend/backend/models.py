from xml.dom import minidom
import os 
import pyodbc
import xml.etree.ElementTree as et
import xmltodict
import glob
import pandas as pd
import zipfile

class Database():
    def __init__(self):
        self.tables = {'database': []}

    def add_table(self, tableName):
        self.tables['database'].append({tableName: []})
    
    def add_cols(self, tableIndex, tableName, colName, colType, colKey, refCols):
        if colKey == 'MUL':
            self.tables['database'][tableIndex][tableName].append(\
                    {'column_name':colName,\
                    'column_type':colType,\
                    'column_key': colKey,\
                    'references': refCols}\
            )
        else:
            self.tables['database'][tableIndex][tableName].append(\
                    {'column_name':colName,\
                    'column_type':colType,\
                    'column_key': colKey,\
                    'references': refCols}\
            )

class ExtractMetadata():
    def __init__(self):
        pass

    def get_metadata(self, db_url, db_name, db_uname, db_pass):
        connection_string = "DRIVER=MySQL ODBC 8.0; \
                            SERVER={};\
                            DATABASE={};\
                            UID={};\
                            PWD={};\
                            Port=3306;\
                            charset=utf8mb4;".format(db_url, db_name, db_uname, db_pass)
        cnxn = pyodbc.connect(connection_string)
        crsr = cnxn.cursor()
        db_wrapper = Database()
        for t in crsr.tables():
            db_wrapper.add_table(t.table_name)
            # You should be able to do this essentially
            # But there is a bug in pyodbc which prevents this from working in mysql
            # https://github.com/mkleehammer/pyodbc/issues/506
            # Until then an execute must be used.
            # for table_schema in crsr.columns(table=t.table_name):
            #     db_wrapper.add_cols(t.table_name, table_schema.column_name, table_schema.type_name)

        db = db_wrapper.tables['database']
        for t_index in range(len(db)):
            t_name = list(db[t_index].keys())[0]
            for row in crsr.execute("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=?", t_name):
                refCols = []
                if row[16] == 'MUL' or row[16] == 'PRI':
                    for r in crsr.execute(\
                        "SELECT TABLE_NAME, COLUMN_NAME \
                        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE\
                        WHERE\
                        REFERENCED_TABLE_SCHEMA=?  AND\
                        REFERENCED_TABLE_NAME=? AND\
                        REFERENCED_COLUMN_NAME=?", db_name, t_name, row[3]\
                    ):\
                        refCols.append({"table_name":r[0], "column_name":r[1]})
                db_wrapper.add_cols(t_index, t_name, row[3], row[7], row[16], refCols)

        return db_wrapper.tables

# Used to create XML document representing the schema
# Schema XSD in ../utils/local_rdb_schema.xsd
class Schema():
    def __init__(self, db_name, db_wrapper):
        self.db_name = db_name
        self.root = et.Element('dbType', attrib=dict({'name': 'SQL'}))
        self.schema_root = et.SubElement(self.root, 'dbSchema', attrib=dict({'name': db_name}))
        # self.root = et.Element('dbSchema', attrib=dict({'name': db_name}))
        # This is the self.tables from Database() class which is a list of tables
        self.tables = db_wrapper['database']

    '''
    Input: table_name, 
    list of list of colums, where each list has col name, data type and type of key

    Adds a table to the root 
    <table name="table_name">
        <column ..../>
        .
        .
        .
    </table>
    ''' 
    def make_schema(self):
        for table_index in range(len(self.tables)):
            
            tableName = list(self.tables[table_index].keys())[0]
            tableCols = self.tables[table_index][tableName]
            
            childTable = et.SubElement(self.schema_root, 'table', attrib=dict({'name': tableName}))
            
            for col in tableCols:
                childCol = et.Element('column', attrib=dict({'name': col['column_name']}))
                # Start of column wise details
                data_type = et.SubElement(childCol, "dataType")
                data_type.text = col['column_type']
                
                column_key = et.SubElement(childCol, "columnKey")
                column_key.text = col['column_key']
                
                references = et.SubElement(childCol, "references")
                for ref in col["references"]:
                    refer = et.SubElement(references, "reference")
                    r_table =  et.SubElement(refer, "referenceTable")
                    r_table.text = ref['table_name']
                    r_column = et.SubElement(refer, "referenceColumn")
                    r_column.text = ref['column_name']

                childTable.append(childCol)
                # End of column wise details
        
        # tree = et.ElementTree(self.root)
        # actual_root = et.Element('dbType', attrib=dict({'name': 'SQL'}))
        # schema_root = et.SubElement(self.root, "dbType")
        # actual_root = et.Element('dbType', attrib=dict({'name': "SQL"}))
        # schema_root = et.SubElement(actual_root, 'table', attrib=self.root)
        return et.ElementTree(self.root)

    # Need to refactor this code
    def write_schema(self, location=None):
        xml_tree = self.make_schema()
        save_path_file = "./backend/xml_outputs/sql_databases_dump.xml"
        with open (save_path_file, "wb") as files :
            xml_tree.write(files)

class XMLParser():
    def __init__(self):
        pass

    def parse_xml(self, file_location):
        with open(file_location, 'r', encoding='utf-8') as file:
            global_xml_contents = file.read()
        converted_dict = xmltodict.parse(global_xml_contents)
        print(converted_dict)
        return converted_dict


class Schema_from_multi_CSVDB():

    def __init__(self):

        self.root_root = et.Element('dbType', attrib=dict({'name' : "CSV"}))
        
        with zipfile.ZipFile('./backend/csv_uploads/csv_databases.zip', 'r') as zip_ref:
            zip_ref.extractall('./backend/csv_uploads/')

        rootdir = './backend/csv_uploads/csv_databases'

        self.dbs = []
        self.dbTrees = []

        for dir_it in os.scandir(rootdir):
            if ( dir_it.is_dir() ):
                database_name = dir_it.path.split('/')[-1]
                self.dbs.append(database_name)

                schema = Schema_from_CSVDB(database_name, dir_it.path)
                its_root = schema.make_schema().getroot()
                self.dbTrees.append(its_root)

    def make_schema(self):
        tree = et.ElementTree(self.root_root)
        tree_root = self.root_root # 
        # print(tree_root)
        for some_root in self.dbTrees:
            tree_root.append(some_root)
        return tree


    # Need to refactor this code
    def write_schema(self, location=None):
        xml_tree = self.make_schema()
        save_path_file = "./backend/xml_outputs/csv_databases_dump.xml"
        with open (save_path_file, "wb") as files :
            xml_tree.write(files)



# Used to create XML document representing the schema
# Schema XSD in ../utils/local_rdb_schema.xsd
class Schema_from_CSVDB():
    def __init__(self, db_name, csv_DB_path):
        self.db_name = db_name
        self.root = et.Element('dbSchema', attrib=dict({'name': db_name}))
        # This is the self.tables from Database() class which is a list of tables
        self.tables = []
        self.df_tables = []

        # csv files in the path
        files = glob.glob(csv_DB_path + "/*.csv")
        
        # checking all the csv files in the 
        # specified path
        for filename in files:
            if(filename[-3:] == "csv"):
                # reading content of csv file
                # content.append(filename)
                df = pd.read_csv(filename)
                fn = filename.split('/')[-1]
                self.tables.append(fn[:-4])
                self.df_tables.append(df)
            

    '''
    Input: table_name, 
    list of list of colums, where each list has col name, data type and type of key

    Adds a table to the root 
    <table name="table_name">
        <column ..../>
        .
        .
        .
    </table>
    ''' 
    def make_schema(self):
        for table_index in range(len(self.tables)):
            
            tableName = self.tables[table_index]
            tableCols = self.df_tables[table_index].columns
            
            childTable = et.SubElement(self.root, 'table', attrib=dict({'name': tableName}))
            
            for col in tableCols:
                childCol = et.Element('column', attrib=dict({'name': col}))
                # Start of column wise details
                data_type = et.SubElement(childCol, "dataType")
                data_type.text = str(self.df_tables[table_index].dtypes[col])
                
                column_key = et.SubElement(childCol, "columnKey")
                # column_key.text = col['column_key']
                
                references = et.SubElement(childCol, "references")

                childTable.append(childCol)
                # End of column wise details
        
        tree = et.ElementTree(self.root) # 
        return tree

    # Need to refactor this code
    def write_schema(self, location=None):
        xml_tree = self.make_schema()
        save_path_file = "test_csv_database_dump.xml"
        with open (save_path_file, "wb") as files :
            xml_tree.write(files)



class Concatenate_SQL_CSV():

    def __init__(self, path_to_dumps):
        
        tree_sql = et.parse(path_to_dumps + 'sql_databases_dump.xml')
        root_sql = tree_sql.getroot()

        tree_csv = et.parse(path_to_dumps + 'csv_databases_dump.xml')
        root_csv = tree_csv.getroot()

        main_root = et.Element('consolidatedDB', attrib=dict({}))
        main_root.append(root_sql)
        main_root.append(root_csv)

        tree = et.ElementTree(main_root)
        
        tree.write(path_to_dumps + 'consolidated_csv_sql.xml')

class Global_Schema():
    def __init__(self, path_to_dumps='./backend/xml_outputs/'):
        self.path_to_dumps = path_to_dumps

    def merge_selected_suggestion(self, suggestion):
        from_parsed_list = suggestion[0].split('.')
        db_type = from_parsed_list[0]
        db_name = from_parsed_list[1]
        db_table = from_parsed_list[2]
        db_column = from_parsed_list[3]
        to_parsed_list = suggestion[1].split('.')
        to_db_type = to_parsed_list[0]
        to_db_name = to_parsed_list[1]
        to_db_table = to_parsed_list[2]
        to_db_column = to_parsed_list[3]
        
        xml_root = et.parse(self.path_to_dumps + 'consolidated_csv_sql.xml').getroot()
        print(xml_root)
        for dbtype in xml_root.findall(".//dbType[@name='{0}']".format(db_type)):
            for dbname in dbtype.findall(".//dbSchema[@name='{0}']".format(db_name)):
                for dbtable in dbname.findall(".//table[@name='{0}']".format(db_table)):
                    for dbcolumn in dbtable.findall(".//column[@name='{0}']".format(db_column)):
                        refer = dbcolumn.find('references')
                        reference = et.SubElement(refer, "reference")
                        r_table =  et.SubElement(reference, "referenceType")
                        r_table.text = to_db_type
                        r_table =  et.SubElement(reference, "referenceDB")
                        r_table.text = to_db_name
                        r_table =  et.SubElement(reference, "referenceTable")
                        r_table.text = to_db_table
                        r_column = et.SubElement(reference, "referenceColumn")
                        r_column.text = to_db_column

        tree = et.ElementTree(xml_root)        
        tree.write(self.path_to_dumps + 'consolidated_csv_sql.xml')

# if __name__ == '__main__':
#     gs = Global_Schema()
#     gs.merge_selected_suggestion(['SQL.companydb.department.dnumber', 'CSV.companydb2.department1.dnumber1'])