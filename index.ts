import express, { Request, Response } from 'express';
import { exec, ExecException } from 'child_process';
import { accessSync } from 'fs';
import { join } from 'path';

const PROJ_NAME = 'cicd_web';                                                   // 项目名称
const GIT_STORAGE = 'http://localhost:8888/wenweiluo/' + PROJ_NAME + '.git';    // 仓库连接
const PORT = 3000;                                                              // 项目端口号
const PROJ_CACHE_DIR = 'C:\\Users\\11522\\Desktop\\faceTest\\proj_cache';       // 设置ci过程cache文件路径

const app = express();
const drive = PROJ_CACHE_DIR.split(':').shift()! + ':';
const action = (cmd: string) => {
  exec(cmd, { encoding: 'utf8' }, (error: ExecException | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(error);
    }
    console.log(stdout);
    console.error(stderr);
  });
}
const clearOrder: string[] = [
  `docker stop ${PROJ_NAME}-ctr`,
  `docker rm -f ${PROJ_NAME}-ctr`,
  `docker rmi -f ${PROJ_NAME}-img`,
];
const freshOrder: string[] = [
  `docker build -t ${PROJ_NAME}-img .`,
  `docker run --name=${PROJ_NAME}-ctr -d -p ${PORT}:${PORT} ${PROJ_NAME}-img`
];
const func = (req: Request, res: Response) => {
  let order = drive;
  const addOrder = (add: string) => {
    order += `&& ${add}`;
  }

  try {
    accessSync(join(PROJ_CACHE_DIR, PROJ_NAME));
    // 拉取
    addOrder(`cd ${join(PROJ_CACHE_DIR, PROJ_NAME)}`);
    addOrder('git pull');
    clearOrder.map(addOrder);
    freshOrder.map(addOrder);
  } catch (error) {
    // 克隆
    addOrder(`cd ${PROJ_CACHE_DIR}`);
    addOrder('dir');
    addOrder(`git clone ${GIT_STORAGE}`);
    addOrder(`cd ${PROJ_NAME}`);
    freshOrder.map(addOrder);
  }
  console.log(order);
  action(order)
  res.send('ci runing...');
}
app.all('/', func);
app.listen(7788, () => {
  console.log('deployserver start');
});
