#!/usr/bin/python
# coding:utf-8


import tushare as ts
import datetime,sys,sqlite3

conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
conn.text_factory = lambda x: unicode(x, 'utf-8', 'ignore')
c = conn.cursor()

def addtrenddata(shrzrz1, shrqrz1, szrzrz1, szrqrz1, rztrend1,today1):
    # conn = sqlite3.connect('/Users/liguoliang/UD78/src/db.sqlite3')
    # conn.text_factory = lambda x: unicode(x, 'utf-8', 'ignore')
    # c = conn.cursor()
    # shrzrz1=shrzrz
    # co=str(Code)
    # s=Stockname

    sql_content = '''select * from Sunland_trend where optdate = '%s' ''' %today1
    c.execute(sql_content)
    res=c.fetchall()
    if len(res)>0:
        print '%s exists' % today1
    else:
        sql_content = "INSERT into Sunland_trend (shrzrz,shrqrz,szrzrz,szrqrz,rztrend,optdate) VALUES (?,?,?,?,?,?)"
        cursor = c.execute(sql_content, [shrzrz1, shrqrz1, szrzrz1, szrqrz1, rztrend1,today1])
        print '%s added' %today1

    conn.commit()
    print "执行成功";
    print "===========================================";


def trend(day):
    days=day
    #today=datetime.datetime.today()
    totalrong_pre=0
    totalrong=0
    #融资融券 15日数据
    start = datetime.date.today()-datetime.timedelta(days)
    #print start.strftime("%Y-%m-%d")
    end = datetime.date.today().strftime("%Y-%m-%d")
    shrzrz= 0
    shrqrz = 0
    szrzrz= 0
    szrqrz= 0
    rztrend=0  ##上海融资日增，融券日增，深圳融资日增，融券日增，两市融资日增

    ####SH#####
    shma = []
    shma=ts.sh_margins(start=start.strftime("%Y-%m-%d"), end=end)
    s=list(shma[u'rzye'])   #资数值
    s1=list(shma[u'rqyl'])   #券
    d=list(shma[u'opDate'])   #日期
    c=s[0]-s[-1]      #头尾差额
    c1=s1[0]-s1[-1]      #头尾差额
    percent=(float(c)/float(s[-1]))*100    #计算百分比
    percent1=(float(c1)/float(s1[-1]))*100    #计算百分比
    totalrong=totalrong+float(s[0])
    totalrong_pre=totalrong_pre+float(s[-1])
    index=0
    # print '上海15天数据为：'
    # while index<len(s):
    #     print d[index],'数据',s[index]/100000000,'亿'
    #     index += 1


    print '数据最新日期',d[0],'共',len(d),'交易日'
    print '*上海资',days,'天增长',c/100000000,'亿','增长百分比',percent,'%','*资最后一日增长',float((s[0]-s[1])/100000000),'亿'
    print '最后两交易日资量：',d[1],s[1],d[0],s[0]
    print '*上海券',days,'天增长',c1,'量','增长百分比',percent1,'%','*券最后一日增长',float((s1[0]-s1[1])),'量'
    print '最后两交易日券量：',d[1],s1[1],d[0],s1[0],'差值：',s1[0]-s1[1]
    shrzrz= float((s[0]-s[1])/100000000)
    shrqrz = float((s1[0]-s1[1]))
    if percent > percent1:
        print '**买'
    elif percent == percent1:
        print '**告警'
    else:
        print '**沽'

    ####SZ#####
    szma=ts.sz_margins(start=start.strftime("%Y-%m-%d"), end=end)
    s=list(szma[u'rzye'])
    s2=list(szma[u'rqyl'])
    d=list(szma[u'opDate'])
    c=s[-1]-s[0]
    c2=s2[-1]-s2[0]
    index=0
    totalrong=totalrong+float(s[-1])
    totalrong_pre=totalrong_pre+float(s[0])
    percent=(float(c)/float(s[0]))*100
    percent2=(float(c2)/float(s2[0]))*100
    # print '深圳15天数据为：'
    # while index<len(s):
    #     print d[index],'数据',s[index]/100000000,'亿'
    #     index += 1
    print '数据最新日期',d[-1],'共',len(d),'交易日'
    print '*深圳资',days,'天增长',c/100000000,'亿','增长百分比',percent,'%','*资最后一日增长',float((s[-1]-s[-2])/100000000),'亿'
    print '最后两交易日资量：',d[-2],s[-2],d[-1],s[-1]
    print '*深圳券',days,'天增长',c2,'量','增长百分比',percent2,'%''*券最后一日增长',float((s2[-1]-s2[-2])),'量'
    print '最后两交易日券量：',d[-2],s2[-2],d[-1],s2[-1],'差值：',s2[-1]-s2[-2]


    szrzrz= float((s[-1]-s[-2])/100000000)
    szrqrz= float((s2[-1]-s2[-2]))

    if percent > percent2:
        print '**买'
    elif percent == percent2:
        print '**告警'
    else:
        print '**沽'

    print '========================================================================='
    print '计算始日两市总额',long(totalrong_pre)/100000000,'计算终日两市总额：',long(totalrong)/100000000,days,'日差额',long((totalrong-totalrong_pre)/100000000)
    print '========================================================================='
    rztrend = (totalrong-totalrong_pre)/100000000

    addtrenddata(shrzrz, shrqrz, szrzrz, szrqrz, rztrend,d[-1])





if __name__ == '__main__':
    if len(sys.argv)>1:
        day=int(sys.argv[1])
        trend(day)
    else:trend(15)




