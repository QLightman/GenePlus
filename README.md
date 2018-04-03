# HiVis
A software built on [electron](https://electronjs.org/) for hierarchical visualization and analysis of interaction networks.

## Usage
Currently, we offer installation packages for linux, windows and mac operating systems.
For linux user, download the ![hivis-linux-x64](https://github.com/QLightman/HiVis/tree/master/installation%20packages/hivis-linux-x64), execute the ![hivis](https://github.com/QLightman/HiVis/blob/master/installation%20packages/hivis-linux-x64/hivis). For win32 user, download the ![hivis-win32-x64](https://github.com/QLightman/HiVis/tree/master/installation%20packages/hivis-win32-x64), execute the ![hivis.exe](https://github.com/QLightman/HiVis/blob/master/installation%20packages/hivis-win32-x64/hivis.exe). For mas user, download the ![hivis-mas-x64](https://github.com/QLightman/HiVis/tree/master/installation%20packages/hivis-mas-x64), execute the ![hivis](https://github.com/QLightman/HiVis/blob/master/installation%20packages/hivis-mas-x64/hivis.app/Contents/MacOS/hivis).
 You can load the **demo1.txt** file into HiVis to see how it works. 

Since there are numerous operating systems exist and each system has many versions, so if we don't provide a installation package for your operating system or you encounter some errors when using the mas, win32 or linux installation package, you can still build **HiVis** yourself by following ![Installation](https://github.com/QLightman/HiVis#installation).

## Installation
First you have to install [electron](https://electronjs.org/), you can choose to install it as a development dependency in your app:
```
npm install electron --save-dev
```
or you can install the [electron](https://electronjs.org/) command globally in your **$PATH**:
```
npm install electron -g
```
then install [electron-forge](https://github.com/electron-userland/electron-forge) which is a complete tool for building modern [electron](https://electronjs.org/) applications.
```
npm install -g electron-forge
electron-forge init HiVis
cd HiVis
```
then replace the **src** folder with ![src](https://github.com/QLightman/HiVis/tree/master/source%20code)

then
```
electron-forge start
```
You can load the **demo1.txt** file into HiVis to see how it works. 

## Input file format
The input file should obey the following format:
```
element1 element2 value 
element1 element3 value 
element2 element1 value 
element3 element1 value ...
```
You can consult **demo1.txt** as an example.

## Download features
By clicking **save.file**, you can get can get a file with all the elements listed in your chosen cluster. So you can do further analysis such as gene ontology analysis. Also, by clicking **save.svg** you
            can get a svg file of your current view.

## License
![MIT](https://github.com/QLightman/HiVis/blob/master/LICENSE)
