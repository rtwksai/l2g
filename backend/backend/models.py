import pyodbc
import xml.etree.ElementTree as et
import xmltodict

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
        self.root = et.Element('dbSchema', attrib=dict({'name': db_name}))
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
            
            childTable = et.SubElement(self.root, 'table', attrib=dict({'name': tableName}))
            
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
        
        tree = et.ElementTree(self.root)
        return tree

    # Need to refactor this code
    def write_schema(self, location=None):
        xml_tree = self.make_schema()
        save_path_file = "test.xml"
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