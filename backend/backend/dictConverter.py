import xmltodict



def parse_xml(file_location):
    with open(file_location, 'r', encoding='utf-8') as file:
        global_xml_contents = file.read()
    converted_dict = xmltodict.parse(global_xml_contents)
    return converted_dict


def extract_table(table_od):
    col_list = []
    if(type(table_od["column"]) ==  type([]) ):
        for i in table_od["column"]:
            col_list.append({"col_name":i["@name"], "data_type" : i["dataType"] })
            
    else: 
        col_list.append({"col_name":table_od["column"]["@name"], "data_type" : table_od["column"]["dataType"] })
    return { table_od["@name"] : col_list}
        

def extract_xml(xml_dict):
    new_dict = {}
    len(xml_dict["dbtype"]["dbSchema"])
    if(type(xml_dict["dbtype"]["dbSchema"]) ==  type([]) ):
        for j in xml_dict["dbtype"]["dbSchema"]:
            list_tables = []
            for i in j["table"]:
                list_tables.append( extract_table(i))
            new_dict[j["@name"]] = list_tables
    else :
        list_tables.append( extract_table(xml_dict["dbtype"]["dbSchema"]["table"]))
    return {xml_dict["dbtype"]["@name"] : new_dict}


def extract_db(old_dict):
    list_tables = []

    if(type(old_dict["dbSchema"]["table"]) ==  type([]) ):
        for i in old_dict["dbSchema"]["table"]:
            list_tables.append( extract_table(i))   
    else: 
        list_tables.append(extract_table(old_dict["dbSchema"]["table"]))

    
    return {old_dict["dbSchema"]["@name"] : list_tables} 




old_dict = parse_xml("/home/k_udupa/Sem8/DM/Project/test1.xml")
new_dict = extract_xml(old_dict)
print(new_dict)