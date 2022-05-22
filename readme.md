# ci/cd

一个运行在win系统简单轻量的ci/cd工具。



准备阶段：

1.安装node环境

2.安装docker



配置：

修改 index.ts中的参数：

PROJ_NAME： 	   项目名称

GIT_STORAGE：	 git仓库url

PORT：					项目端口号

PROJ_CACHE_DIR：ci过程的缓存文件路径



使用：

1.拉取项目到指定计算机

2.进入目录运行 npm install && npm run start

3.到git仓库挂载钩子。设置为merge后调用本接口。



文档建设中。。。