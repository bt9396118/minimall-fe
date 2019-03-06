/*
 * @Author: baotong 
 * @Date: 2018-12-07 20:44:38 
 * @Last Modified by: baotong
 * @Last Modified time: 2019-03-06 21:57:18
 */
const path = require('path');
const webpack=require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

//环境变量的配置，dev/online,一般使用NODE_ENV，为避免冲突直接使用WEBPACK_ENV命名
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
//获取html-webpack-plugin参数的方法
let getHTmlConfig=function (name) {
    return {
        template: './src/view/'+ name +'.html',//html原始文件的位置
        filename: 'view/'+ name +'.html',//目标文件的位置
        inject: true,
        hash: true,
        chunks: ['common', name]
    }
}
//webpack config
let config = {
    entry: {
        'common': ['./src/page/common/index.js'], //chunk名
        'index':['./src/page/index/index.js'],
        'login':['./src/page/login/index.js'],
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),//存放路径，即生成的dist文件的目录
        publicPath:'/dist'//打包后访问资源时的url根目录
    },
    externals:{
        'jquery':'window.jQuery'
    },
    module: {
        rules: [
            {
                test: /\.css$/,//探测到以css为结尾的文件
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,//探测图片
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 15000,
                            name:'/resource/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        //独立通用模块
        //把css单独打包到文件里
        new MiniCssExtractPlugin({
            //filename: "css/index.css", //这里的name是cacheGroup中设定的name,要么在这里给定自定义name比如index，要么在选项chunkFilename配置
            chunkFilename:"css/index.css"
        }),
        //html模板的处理
        new HtmlWebpackPlugin(getHTmlConfig('index')),
        new HtmlWebpackPlugin(getHTmlConfig('login')),
    ],
    optimization:{
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "common",//共享出来的块的名字
                    filename:'js/base.js',
                    chunks: "initial", //显示块的范围，initial(初始块)、async(按需加载块)、all(全部块)，默认为all
                    minChunks: 1,//代码分割前共享模块的最小块数，我这里只打包了一个，默认值为1
                    minSize: 0 //必须要写，表示在压缩前的最小模块大小，webpack的默认值是30K
                }
                /* styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'initial',
                    enforce: true
                } */
            }
        }
    } 
};
//开发环境（dev）时加上这个工具，线上环境（online）时就不会加
if ('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
} 

module.exports=config;
