# HiVis
A software built on [electron](https://electronjs.org/) for hierarchical visualization and analysis of interaction networks.

## Usage
There is not installation required. 
Just download the hiVis-linux-x64 package, start the software by clicking *HiVis* file. You can load the *demo1.txt* file into HiVis to see how it works. 

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
```
then replace the **src** folder with ![source code](https://github.com/QLightman/HiVis/tree/master/source%20code)

then
```
cd HiVis
electron-forge start
```



## License
![MIT](https://github.com/QLightman/HiVis/blob/master/LICENSE)
