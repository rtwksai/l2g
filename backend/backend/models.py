import pyodbc

class Database():
    def __init__(self):
        self.tables = {'database': []}

    def add_table(self, tableName):
        self.tables['database'].append({tableName: []})
    
    def add_cols(self, tableIndex, tableName, colName, colType):
        self.tables['database'][tableIndex][tableName].append({'column_name':colName, 'column_type':colType})

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
            print(t_index, db[t_index].keys())
            t_name = list(db[t_index].keys())[0]
            for row in crsr.execute("select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=?", t_name):
                db_wrapper.add_cols(t_index, t_name, row[3], row[7])

        return db_wrapper.tables