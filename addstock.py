#!/usr/bin/python
# coding:utf-8

import sqlite3

def addstock(Market,Code,Stockname):
    conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    conn.text_factory = lambda x: unicode(x, 'utf-8', 'ignore')
    c = conn.cursor()
    m=Market
    co=str(Code)
    s=Stockname

    sql_content="INSERT into Sunland_stock (Market,Code,Stockname) VALUES (?,?,?)"
    cursor = c.execute(sql_content, [m, co, s])

    cursor = c.execute("select * from Sunland_stock")
    print "ID       ""Market   "  "Code    "  "StockName   "
    for row in cursor:
        print row[0],"     ",row[1],"     ",row[2], "       ",row[3],"       "
    for row in cursor:
        print "ID     ", row[0]
        print "Market" ,row[1]
        print "Code"   , row[2]
        print "Stock Name" , row[3]
    conn.commit()
    print "Operate sunland success fully";
    print "===========================================";


addstock('sh',600012,'们者')