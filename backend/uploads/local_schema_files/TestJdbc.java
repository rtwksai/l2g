import java.net.PasswordAuthentication;
import java.sql.*;
import java.util.*;
import java.io.*;
import java.time.Duration;
import java.time.Instant;

public class TestJdbc
{
    
    static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";  
    static final String DB_URL = "jdbc:mysql://localhost/contactdb?useSSL=false";

    static final String USER = "root";
    static final String PASS = "pass";
    public static void main(String[] args) {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        
        try {
            Class.forName(JDBC_DRIVER);
            
            // System.out.println("Connecting to database...");
            conn = DriverManager.getConnection(DB_URL,USER,PASS);
            int batch_size = 1000;
            
            // System.out.println("Creating statement...");
            stmt = conn.createStatement();

            String insert_stmt = "INSERT INTO contact(contact_id, contact_name, contact_number) VALUES (?, ?, ?)";            
            PreparedStatement insertContact = conn.prepareStatement(insert_stmt);

            int count = 0;
            Instant start_time = Instant.now();

            while (count < 20000000) {    
                int c_id = count+1000000;
                String c_name = "Name of "+count;
                String c_num = "Phone of "+count;

                insertContact.setInt(1, c_id);
                insertContact.setString(2, c_name);
                insertContact.setString(3, c_num);

                insertContact.addBatch();
                
                count += 1;
                if (count%batch_size == 0) {
                    insertContact.executeBatch();
                    Instant curr_time = Instant.now();
                    System.out.println((Duration.between(start_time, curr_time).toMillis())+": Inserted "+count+" entires");
                    start_time = Instant.now();
                }
            }
        }

        catch (SQLException se) {
            se.printStackTrace();
        } 

        catch(Exception e)  {
            e.printStackTrace();
        }
        
        finally {
            try {
                if (rs != null) {rs.close();}
                if (stmt != null) { stmt.close();}
                if (conn != null) {conn.close();}
            }

            catch(SQLException se) {se.printStackTrace();}
        }
    }
}
