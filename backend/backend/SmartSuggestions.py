import nltk
from nltk.corpus import *
import xmltodict
import editdistance


class Preparator():
    def __init__(self):
        pass

    def parse_xml(self, file_location):
        with open(file_location, 'r', encoding='utf-8') as file:
            global_xml_contents = file.read()
        converted_dict = xmltodict.parse(global_xml_contents)
        return converted_dict

    # Updated table_od -> table_od[0]
    def extract_table(self, table_od):
        print(table_od)
        col_list = []
        if(type(table_od[1]["column"]) ==  type([]) ):
            for i in table_od[1]["column"]:
                col_list.append({"col_name":i["@name"], "data_type" : i["dataType"] })
                
        else: 
            col_list.append({"col_name":table_od[1]["column"]["@name"], "data_type" : table_od[1]["column"]["dataType"] })
        return { table_od[1]["@name"] : col_list}


    # fix this to work with consolidated xml
    def extract_xml(self, xml_dict):
        new_dict = {}
        list_tables = []
        if(type(xml_dict["dbType"]["dbSchema"]) ==  type([]) ):
            for j in xml_dict["dbType"]["dbSchema"]:
                list_tables = []
                for i in j["table"]:
                    if type(i) != str:
                        list_tables.append(self.extract_table(i))
                new_dict[j["@name"]] = list_tables
        else :
            list_tables.append( self.extract_table(xml_dict["dbType"]["dbSchema"]["table"]))
        return {xml_dict["dbType"]["@name"] : new_dict}


    def extract_db(self, old_dict):
        list_tables = []
        if(type(old_dict["dbSchema"]["table"]) ==  type([]) ):
            for i in old_dict["dbSchema"]["table"]:
                list_tables.append( self.extract_table(i))   
        else: 
            list_tables.append(self.extract_table(old_dict["dbSchema"]["table"]))

        
        return {old_dict["dbSchema"]["@name"] : list_tables} 


# old_dict = parse_xml("/home/k_udupa/Sem8/DM/Project/l2g/backend/backend/test_dump.xml")
# old_dict = parse_xml("/home/k_udupa/Sem8/DM/Project/test1.xml")
# new_dict = extract_xml(old_dict)


class SmartSuggestions():
    def __init__(self):
        self.check_col = None
        self.similar_cols = []
        self.full_similar_cols = {}


    def get_data(self, data):
        self.schema = data


    def exhaustive_search(self):
        for db_type in self.schema:
            # print("db type =", db_type)
            db_list = self.schema[db_type]
            for db_name in db_list:
                # print("db name =", db_name)
                table_list = db_list[db_name]
                for table_dict in table_list:
                    table_name = list(table_dict.keys())[0]
                    # print("Table name =", table_name)
                    col_list = table_dict[table_name]
                    for col_dict in col_list:
                        full_col_name = db_type + "." + db_name + "." + table_name + "." + col_dict["col_name"]
                        self.similarity_checks(col_dict, full_col_name)
                        # return self.full_similar_cols


    def similarity_checks(self, col, full_col_name):
        self.check_col = col
        self.similar_cols = []
        for db_type in self.schema:
            # print("db type =", db_type)
            db_list = self.schema[db_type]
            for db_name in db_list:
                # print("db name =", db_name)
                table_list = db_list[db_name]
                for table_dict in table_list:
                    table_name = list(table_dict.keys())[0]
                    # print("Table name =", table_name)
                    col_list = table_dict[table_name]
                    for col_dict in col_list:
                        # print("col =", col_dict["col_name"])
                        similar = False
                        if self.editDistance(self.check_col, col_dict):
                            similar = True
                        if self.vocabMatch(self.check_col, col_dict):
                            similar = True
                        
                        if similar:
                            matching_col = db_type + "." + str(db_name) + '.' + str(table_name) + '.' + col_dict['col_name']
                            self.similar_cols.append(matching_col)
        self.full_similar_cols[full_col_name] = self.similar_cols[1:]
        return self.similar_cols


    # Module-1 : Edit distance check.
    def editDistance(self, col_dict1, col_dict2):
        colname1 = col_dict1["col_name"]
        colname2 = col_dict2["col_name"]
        edit_score = editdistance.eval(colname1, colname2)
        # print("edit score =", edit_score)
        if edit_score > 2:
            return False
        return True


    # Module-2 Data type check.
    def dataTypeMatch(self, check_col, col):
        # print(check_col)
        # print(col)
        if col['data_type'] == check_col['data_type']:
            return True
        return False


    # Module-3 Vocabulary match.
    def vocabMatch(self, col1, col2):
        synonyms = []
        for syn in wordnet.synsets(col2['col_name']):
            for i in syn.lemmas():
                synonyms.append(i.name())
        for similar_word in synonyms:
            if self.editDistance({"col_name": similar_word}, col1) <= 2:
                return True
        return False
            

# suggestor = SmartSuggestions()
# suggestor.get_data(new_dict) # This will save the global xml file into the object variable.
# suggestor.exhaustive_search()
# print("Similar columns =", suggestor.full_similar_cols)