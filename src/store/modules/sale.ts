import { observable, action } from "mobx";

class SaleStore {
  @observable text; // 注册变量，使其成为可检测的
  @observable num;

  constructor() {
    this.num = 100; // 初始化变量，可以定义默认值
    this.text = "saleStore";
  }

  @action  // 方法推荐用箭头函数的形式
  plus = () => {
    this.num += 1;
  };

  @action
  minus = () => {
    this.num -= 1;
  };
}

const saleStore = new SaleStore(); 

export { saleStore };