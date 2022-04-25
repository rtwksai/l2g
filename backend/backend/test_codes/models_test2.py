import sched
from xml.dom import minidom
import os
import glob
import pyodbc
import xml.etree.ElementTree as et
import xmltodict
import pandas as pd

# Used to create XML document representing the schema
# Schema XSD in ../utils/local_rdb_schema.xsd
class Schema_from_CSVDB():
    def __init__(self, db_name, csv_DB_path):
        self.db_name = db_name
        self.root_root = et.Element('dbType', attrib=dict({'name' : "CSV"}))
        self.root = et.SubElement(self.root_root, 'dbSchema', attrib=dict({'name': db_name}))
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
                # for ref in col["references"]:
                #     refer = et.SubElement(references, "reference")
                #     r_table =  et.SubElement(refer, "referenceTable")
                #     r_table.text = ref['table_name']
                #     r_column = et.SubElement(refer, "referenceColumn")
                #     r_column.text = ref['column_name']

                childTable.append(childCol)
                # End of column wise details
        
        tree = et.ElementTree(self.root_root) # 
        return tree

    # Need to refactor this code
    def write_schema(self, location=None):
        xml_tree = self.make_schema()
        save_path_file = "test_dump.xml"
        with open (save_path_file, "wb") as files :
            xml_tree.write(files)