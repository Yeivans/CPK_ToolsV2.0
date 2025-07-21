#!/bin/bash

echo "============================================"
echo "   CPK Analysis Tools - GitHub 部署脚本"
echo "============================================"
echo

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "错误：请在项目根目录运行此脚本！"
    exit 1
fi

echo "1. 检查Git状态..."
git status

echo
echo "2. 添加所有文件到Git..."
git add .

echo
read -p "请输入提交信息（直接回车使用默认信息）: " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update: CPK Tools improvements"
fi

echo "3. 提交代码..."
git commit -m "$commit_msg"

echo
echo "4. 推送到GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo
    echo "============================================"
    echo "         部署成功！"
    echo "============================================"
    echo
    echo "你的网站将在几分钟内更新："
    echo "https://你的用户名.github.io/cpk-tools/"
    echo
    echo "查看部署状态："
    echo "https://github.com/你的用户名/cpk-tools/actions"
    echo
else
    echo
    echo "============================================"
    echo "         部署失败！"
    echo "============================================"
    echo
    echo "请检查："
    echo "1. 是否已设置Git远程仓库"
    echo "2. 是否有权限推送到仓库"
    echo "3. 网络连接是否正常"
    echo
fi

read -p "按任意键继续..."
