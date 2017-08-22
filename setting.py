#!/usr/bin/python
# coding:utf-8

import sqlite3
import sys, getopt



def main(argv):
    try:
        opts, args = getopt.getopt(argv, "hidts")
    except getopt.GetoptError:
        print 'setting.py -h help'

    for opt, arg in opts:
        if opt == '-h':
            print 'setting.py -i 建仓库表 -d 删除仓库表 -a add stock'
            sys.exit()
        elif opt == '-i':
            print '创建数据表'
            create_Stockbasetable()
            sys.exit()
        elif opt == '-d':
            print '删除数据表'
            delete_Stockbasetable()
            sys.exit()
        elif opt == '-t':
            print '创建趋势表'
            create_trendtable()
            sys.exit()
        elif opt == '-s':
            print '创建上海历史趋势表'
            create_trendshhistable()
            sys.exit()
        # elif opt == '-a':
        #     print '增加数据的格式为：sz,000000,天天股份'
        #     addstock()
        #     sys.exit()
#print '参数个数为:', len(sys.argv), '个参数。'
#print '参数列表:', str(sys.argv)




# 初始化数据库 =================================================

## 数据库连接
##初始化表
def create_Stockbasetable():
    conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    c = conn.cursor()
    print "Opened database successfully；连接数据库成功";
    print "==========================================================";
    conn1 = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    c = conn1.cursor()
    try:
        c.execute('''CREATE TABLE Sunland_stock
               (ID INTEGER PRIMARY KEY     NOT NULL ,
               Market           TEXT    NOT NULL,
               code            INT     NOT NULL,
               StockName        CHAR(20)
               );''')
        print 'Stock base Table created successfully；股票基本表创建成功'
    except:
        print 'The Stock base Table aleady exist!；股票基本表已经存在'
    conn.commit()
    conn.close()

def create_trendtable():
    conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    c = conn.cursor()
    print "Opened database successfully；连接数据库成功";
    print "==========================================================";
    conn1 = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    c = conn1.cursor()
    try:
        c.execute('''CREATE TABLE Sunland_trend
               (ID INTEGER PRIMARY KEY     NOT NULL ,
               shrzrz           INT    ,
               shrqrz           INT     ,
               szrzrz           INT     ,
               szrqrz           INT     ,
               rztrend        INT      ,
               optdate        date
               );''')
        print '趋势表创建成功'
    except:
        print '趋势表创建失败'
    conn.commit()
    conn.close()

    """
               opDate           INT    ,  '交易日期'
               rzye           INT     ,    '本日融资余额(元)'
               rzmre           INT     ,    '本日融资买入额'
               rqyl           INT     ,      '本日融券余量'
               rqylje        INT      ,     '本日融券余量金额(元)'
               rqmcl        INT ,           '本日融券卖出量'
               rzrqjyzl     INT         '本日融资融券余额(元)'
               """

def create_trendshhistable():
    conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    c = conn.cursor()
    print "Opened database successfully；连接数据库成功";
    print "==========================================================";
    conn1 = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    c = conn1.cursor()
    try:
        c.execute('''CREATE TABLE Sunland_trendshhis
               (ID INTEGER PRIMARY KEY     NOT NULL ,
               opDate           INT    , 
               rzye           INT     , 
               rzmre           INT     ,  
               rqyl           INT     ,    
               rqylje        INT      ,    
               rqmcl        INT ,         
               rzrqjyzl     INT         
               );''')
        print '上海趋势历史表创建成功'
    except:
        print '上海趋势历史表创建失败'
    conn.commit()
    conn.close()


##删除表
def delete_Stockbasetable():
    conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    c = conn.cursor()
    print "Opened database successfully;连接数据库成功";
    print "==========================================================";
    conn1 = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    try:
        c.execute('''drop table Sunland_stock;''' )
        print 'Drop the table successed!删除股票基本表成功'
    except:
        print 'Drop the table failed!删除股票基本表失败'


##删除表
def insert_newStock(id,code,stockname):
    conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    c = conn.cursor()
    print "Opened database successfully";
    c.execute("INSERT into Sunlandli_stock (ID,Market,Code,Stockname) VALUES (null, %id,%code,%stockname)")



if __name__ == "__main__":
   main(sys.argv[1:])