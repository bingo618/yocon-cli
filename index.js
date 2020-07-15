#!/usr/bin/env node

const fs = require("fs");
const inquirer = require("inquirer");
const { program } = require("commander");
const download = require("download-git-repo");
const ora = require("ora");
const chalk = require("chalk");
const logSymbols = require("log-symbols");
const handlebars = require("handlebars");
const version = require("./package.json").version;

program.version(version, "-v, --version");

console.log(chalk.yellow("欢迎使用，yocon-cli脚手架工具"));

program
  .command("create <project>")
  .description("初始化项目模版")
  .option("-d --dir <dir>", "创建目录")
  .action(function (project) {
    if (fs.existsSync(project)) {
      console.log(logSymbols.error, chalk.red("项目已存在"));
      return;
    }
    inquirer
      .prompt([
        {
          name: "type",
          type: "list",
          message: "请选择项目模版类型",
          choices: ["微应用模版", "小程序模版"],
        },
        {
          name: "description",
          message: "请输入项目描述",
        },
        {
          name: "author",
          message: "请输入作者名称",
        },
      ])
      .then((answers) => {
        const spinner = ora("正在下载模版...").start();
        let downloadUrl = "";
        if (answers.type === "微应用模版") {
          downloadUrl =
            "direct:https://github.com/bingo618/micro-app-template.git";
        } else {
          downloadUrl =
            "direct:https://github.com/bingo618/micro-app-template.git";
        }
        download(downloadUrl, project, { clone: true }, (err) => {
          if (err) {
            spinner.fail();
            return console.log(
              logSymbols.error,
              chalk.red("下载失败，失败原因：" + err)
            );
          } else {
            spinner.succeed();
            const fileName = `${project}/package.json`;
            const meta = {
              name: project,
              description: answers.description,
              author: answers.author,
            };
            if (fs.existsSync(fileName)) {
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            return console.log(logSymbols.success, chalk.green("下载成功"));
          }
        });
      });
  });

program.parse(process.argv);
