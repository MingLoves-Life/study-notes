### 多个commit合成一个commit

1. 取合并最前commit的前一个commit id

2. ```bash
   git rebase -i commit id
   ```

3. 进入vim页面，将`pick`替换为`squash`，最上方为最后commit

4. 修改commit信息，`wq`保存退出   

   ##### 不连续commit

   在vim页面，将想要合并的commit剪切到最上方


