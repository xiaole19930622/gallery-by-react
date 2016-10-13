require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

// 获取图片相关信息
var imageDatas =  require("../data/imageDatas.json");

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas =( function genImgUrl(imgDataArr){
    for (var i = 0 ;i < imgDataArr.length ; i++){
      var singleImgData = imgDataArr[i];

      var imgUrl = require("../images/"+singleImgData.fileName);
      singleImgData.imgUrl = imgUrl;

      imgDataArr[i] = singleImgData;
    }
    return imgDataArr;
  }
)(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">bbbbbbbbb</section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
