import sched
from xml.dom import minidom
import os
import glob
import pyodbc
import xml.etree.ElementTree as et
import xmltodict
import pandas as pd
import zipfile

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




if(__name__=="__main__"):
    schema = Concatenate_SQL_CSV('./backend/xml_outputs/')
    # schema.write_schema()
