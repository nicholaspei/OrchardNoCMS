Brochard
========

Orchard ASP.NET 5版本

Getting Started(可以先看英文说明吧，我回头给更新一下说明)
---------------

First install the KVM, and make sure you are on the Dev Branch. You will know this once you do a kvm update and it pulls down beta-2 files. Also note you should be using the CLR and not CoreCLR for the time being (unless you want to get it running in CoreCLR and do a PR back)

git clone https://github.com/nicholaspei/OrchardNoCMS.git

load in VS15 and Build - Check the project properties to make sure you are targetting the right runtime. (target the one you use as default in 'kvm list')

Next run "k web" from Brochard\src\OrchardVNext.Web


说明
---------------
目前处于开发阶段，如果你想学习asp.net 5那么这是个不错的选择。代码量比较少，可以很快读懂如何做一个模块化的开发框架。

声明
---------------
本分支作为另外一个Nicholas的分支，进行开发合并，会在更新代码的同时说明自己的学习心得。
