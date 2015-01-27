
OrchardNoCMS vNext

Getting Started
---------------

First install the KVM, and make sure you are on the Dev Branch. You will know this once you do a kvm update and it pulls down beta-3 files. Also note you should be using the CLR and not CoreCLR for the time being (unless you want to get it running in CoreCLR and do a PR back)

![image](https://github.com/nicholaspei/OrchardNoCMS/blob/gh-pages/img/20150122125850.png)

git clone https://github.com/nicholaspei/OrchardNoCMS.git

load in VS15 and Build - Check the project properties to make sure you are targetting the right runtime. (target the one you use as default in 'kvm list')

Next run "k web" from Brochard\src\OrchardVNext.Web
