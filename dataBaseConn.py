import pymysql

db = pymysql.connect("localhost","alex","alex","tempandhum" )
db.begin()
print("hsllo")
db = pymysql.connect()
cursor = db.cursor()
sql = "INSERT INTO TempandHum (temp,hum) values ('20','40')"
try:
    cursor.execute(sql)
    db.commit()
except:
    db.rollback()
db.close()