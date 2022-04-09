
colname = "Ticket"
dataType = "Big Integer"

col = {"col_name" : colname, "data_type" : dataType}
# Here, db_type should be csv/sql (from which data model the data is obtained)
# db1_name is for example companydb
# table1_name is the name of the tables present in that particular database.
schema = {
    "db_type" : {
        "db1_name" : [
                {"table1_name" : [col, col]}, # this is list of columns present in that table. Look at line 5, for how col should be declared.
                {"table2_name" : [col, col]}
            ],
        "db2_name" : [
                {"table" : [col, col]},
                {"table1" : [col, col]}
            ]
    }
}


class SmartSuggestions():
    def __init__(self, col):
        self.check_col = col
        self.similar_cols = []


    def get_data(self, data):
        self.schema = data
    
    def similarity_checks(self):
        for db_type in self.schema:
            print("db type =", db_type)
            db_list = self.schema[db_type]
            for db_name in db_list:
                print("db name =", db_name)
                table_list = db_list[db_name]
                for table_dict in table_list:
                    table_name = list(table_dict.keys())[0]
                    print("Table name =", table_name)
                    col_list = table_dict[table_name]
                    for col_dict in col_list:
                        print(col_dict)

    def dataTypeMatch():
        pass

    def editDistance():
        pass

suggestor = SmartSuggestions(col)
suggestor.get_data(schema)
suggestor.similarity_checks()
print("Similar columns =", suggestor.similar_cols)