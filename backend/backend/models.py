import pyodbc

class Database():
    def __init__(self):
        self.tables = {}

    def add_table(self, tableName):
        self.tables[tableName] = {}
    
    def add_cols(self, tableName, colName, colType):
        if tableName in self.tables:
            self.tables[tableName]['column_name'] = colName
            self.tables[tableName]['column_type'] = colType

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

        for t_name in db_wrapper.tables.keys():
            for row in crsr.execute("select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=?", t_name):
                db_wrapper.add_cols(t_name, row[3], row[7])

        return db_wrapper.tables