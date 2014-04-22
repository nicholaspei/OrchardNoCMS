OrchardNoCMS
============
Orchard CMS是针对CMS开发的，对于很多开发需求来说，内容管理这块儿可能并不需要，而需要它的模块式开发模式。所以我这里通过对OrchardCMS进行瘦身，去除
内容管理部分的内容，保留简单的运行环境和基础的模块。需要做的工作：
+ 去除Orchard Framework的内容管理部分，同时去除Orchard Framework依赖内容管理的相关内容。
+ 去除Orchard Core部分的部分module，只保留Sharpe和Setting两个模块。
+ 去除内容管理和博客管理的相关模块，只保留支持模块启用和停用以及皮肤模块。


## Documentation
WIKI： [documentation](http://nicholaspei.github.io/OrchardNoCMS/)

## About the Database
默认是使用使用SqlCE数据库，如果你使用的Sql Server，请打开如下的路径[sql](https://github.com/nicholaspei/OrchardNoCMS/blob/master/OrchardNoCMS.sql)，
创建数据库，并修改数据库连接字符串，在Settings.txt文件中。

```
DataProvider: SqlCe 修改为：DataProvider: SqlServer
DataConnectionString: null 修改为：DataConnectionString:  Data Source=127.0.0.1;Initial Catalog=orchardnocms;
Persist Security Info=True;User ID=xxx;Password=xxx;
```

## About  Build
当你克隆或者下载zip包到本地后，请重新编译一下解决方案，否则无法运行。

