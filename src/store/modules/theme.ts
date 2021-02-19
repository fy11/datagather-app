import { observable, action } from "mobx";

class ThemeStore {
  @observable projectTitle; // 注册变量，使其成为可检测的
  @observable projectDescription;
  @observable talkIcon;
  @observable backColor;
  @observable avatarImg;
  @observable showAvatar;

  constructor() {
  }

  @action  // 方法推荐用箭头函数的形式
  setData = ({projectTitle,backColor,projectDescription,talkIcon,avatarImg,showAvatar}) => {
    this.projectTitle = projectTitle!=undefined?projectTitle:this.projectTitle;
    this.projectDescription = projectDescription!=undefined?projectDescription:this.projectDescription;
    this.talkIcon = talkIcon!=undefined?talkIcon:this.talkIcon;
    this.backColor = backColor!=undefined?backColor:this.backColor;
    this.avatarImg = avatarImg!=undefined?avatarImg:this.avatarImg;
    this.showAvatar = showAvatar!=undefined?showAvatar:this.showAvatar;
  };
}

const themeStore = new ThemeStore(); 

export { themeStore };