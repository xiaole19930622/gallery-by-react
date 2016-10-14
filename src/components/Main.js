require('normalize.css/normalize.css');
require('styles/App.scss');

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


var ImgFigure = React.createClass({
  render:function () {
    return (
      <figure  className="img-figure">
        <img src={this.props.data.imgUrl}
        alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }

});



class AppComponent extends React.Component {
  render() {

    var controllerUnits = [],
         imgFigures = [];
    imageDatas.forEach(function (value) {
      imgFigures.push(<ImgFigure data={value}/>)
    })

    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
