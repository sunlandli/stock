#!/usr/bin/python
# coding:utf-8

import sqlite3

conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
c = conn.cursor()
print "Opened database successfully";


cursor = c.execute("select * from hammar_stock")


print "Market   "  "Code    "  "StockName   "
for row in cursor:
    print row[1],"     ",row[2], "       ",row[3],"       "
for row in cursor:
    print "Market" ,row[1]
    print "Code"   , row[2]
    print "Stock Name" , row[3]

print "Operate hammar success fully";
print "===========================================";

c = conn.cursor()
cursor = c.execute("INSERT into Sunland_stock (ID,Market,Code,Stockname) VALUES (1,'sz', 23423,'天天')");
cursor = c.execute("select * from Sunland_stock")
print "Market   "  "Code    "  "StockName   "
for row in cursor:
    print row[1],"     ",row[2], "       ",row[3],"       "
for row in cursor:
    print "Market" ,row[1]
    print "Code"   , row[2]
    print "Stock Name" , row[3]


conn.commit()
print "Operate sunland success fully";
print "===========================================";



conn.close()



