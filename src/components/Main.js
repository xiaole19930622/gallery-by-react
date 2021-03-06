require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

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

// 控制组件
var ControllerUnit = React.createClass({
  handleClick: function (e) {

    // 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.preventDefault();
    e.stopPropagation();
  },
  render: function () {
    var controlelrUnitClassName = "controller-unit";

    // 如果对应的是居中的图片，显示控制按钮的居中态
    if (this.props.arrange.isCenter) {
      controlelrUnitClassName += " is-center";

      // 如果同时对应的是翻转图片， 显示控制按钮的翻转态
      if (this.props.arrange.isInverse) {
        controlelrUnitClassName += " is-inverse";
      }
    }

    return (
      <span className={controlelrUnitClassName} onClick={this.handleClick}></span>
    );
  }
});

//图片组件
var ImgFigure = React.createClass({

  /*
   * imgFigure 的点击处理函数
   */
  handleClick :function (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },

  render:function () {
    var styleObj = {};

    //如果这张图片中有位置信息，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值并且不为0， 添加旋转角度
    if(this.props.arrange.rotate){
      styleObj["transform"] = 'rotate('+this.props.arrange.rotate+"deg)";
    }

    debugger;
    // 如果是居中的图片， z-index设为11
    if (this.props.arrange.isCenter) {
      styleObj.zIndex=11;
    }

    // 图片翻转
    var imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";


    return (
      <figure  className={imgFigureClassName} style = {styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imgUrl}
        alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" >
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }

});



class AppComponent extends React.Component {

  state = {
    imgsArrangeArr: [
      /*{
       pos: {
       left: '0',
       top: '0'
       },
       rotate: 0,    // 旋转角度
       isInverse: false,    // 图片正反面
       isCenter: false,    // 图片是否居中
       }*/
    ]
  };

  /*
     在初始化render之后只执行一次，在这个方法内，可以访问任何组件，componentDidMount()方法中的子组件在父组件之前执行
     从这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，或者发起网络请求
  */
  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount(){
     //拿到舞台大小
     var stageDOM = this.refs.stage,
          stageW = stageDOM.scrollWidth,
          stageH = stageDOM.scrollHeight,
          halfStageW = Math.ceil( stageW / 2 ),
          halfStageH = Math.ceil( stageH / 2);

    //拿到一个imgfigure的大小
    var imgfigureDOM = ReactDOM.findDOMNode( this.refs.imgFigure0 ),
        imgW = imgfigureDOM.scrollWidth,
        imgH = imgfigureDOM.scrollHeight,
        halfImgW = Math.ceil( imgW / 2),
        halfImgH = Math.ceil( imgH /2);

    //计算中心图片的位置点
    this.props.Constant.centerPos = {
      left : halfStageW - halfImgW,
      top : halfStageH - halfImgH
    }
    //图片左侧的 X 轴的范围
    this.props.Constant.hPosRange.leftSecX[0] = 0 - halfImgW;
    this.props.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    //图片右侧的 X 轴范围
    this.props.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.props.Constant.hPosRange.rightSecX[1] = stageW - halfImgW ;
    //水平坐标的 Y 轴
    this.props.Constant.hPosRange.y[0] = 0 - halfImgH;
    this.props.Constant.hPosRange.y[1] = stageH - halfImgH;

    //上分区 Y 轴
    this.props.Constant.vPosRange.topY[0] = 0 - halfImgH;
    this.props.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;

    //上分区 X 轴
    this.props.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.props.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0)
  };
  inverse(index){
   return function(){
     debugger;
     var imgsArrangeArr = this.state.imgsArrangeArr;
     imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
     this.setState({
       imgsArrangeArr : imgsArrangeArr
     })
   }.bind(this)
  };

  /*
   * 获取区间内的一个随机值
   */
  getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  };

  /*
   * 返回一个 0~30deg的角度
   */
  get30DegRandom(){
    return ( (Math.random() > 0.5 ? "" : "-") + Math.ceil( Math.random() * 30 ) )
  };

  /*
   * 利用arrange函数， 居中对应index的图片
   * @param index, 需要被居中的图片对应的图片信息数组的index值
   * @returns {Function}
   */
  center(index){
    return function () {
      this.rearrange(index);
    }.bind(this)
  }

  //指定居中排布那个图片
  rearrange( centerIndex){
     var _this = this;
     var imgsArrangeArr = this.state.imgsArrangeArr,
       // 取出垂直与水平方向的变量
         Constant = this.props.Constant,
         centerPos = Constant.centerPos,
         hPosRange = Constant.hPosRange,
         vPosRamge = Constant.vPosRange,

       //确认水平方向的 X 轴的区间
         hPosRangeLeftSecX = hPosRange.leftSecX,
         hPosRangeRightSexX = hPosRange.rightSecX,
       //确认水平方向的 Y 轴的区间
         hPosRangeY = hPosRange.y,

       //确认顶部图片的取值范围
         vPosRangTopY = vPosRamge.topY,
         vPosRangeX = vPosRamge.x,

         imgsArrangeTopArr = [],
         topImgNum = Math.floor(Math.random() * 2) ,//   结果为 0 | 1
         topImgSpliceIndex = 0,

         imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

    // 首先居中中心图片的位置信息
    imgsArrangeCenterArr[0] ={
      pos : centerPos ,
      rotate : 0,
      isCenter: true,    // 图片是否居中
    }  ;

    //取出上面位置的图片信息
    topImgSpliceIndex = Math.ceil( Math.random() * (imgsArrangeArr.length - topImgNum) );
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局上恻图片
    imgsArrangeTopArr.forEach(function(value,index){
      imgsArrangeTopArr[index] = {
        pos : {
          top : _this.getRangeRandom(vPosRangTopY[0],vPosRangTopY[1]) ,
          left :_this.getRangeRandom( vPosRangeX[0],vPosRangeX[1])
        },
        rotate : _this.get30DegRandom(),
        isCenter: false,    // 图片是否居中
      }
    });

    // 布局左右两侧的图片

    for(var i = 0,j = imgsArrangeArr.length , k = j / 2;i < j ; i++ ){
      var hPosRangeLORX = null;

      // 前半部分布局左边， 右半部分布局右边
      if( i < k ){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else {
        hPosRangeLORX = hPosRangeRightSexX;
      }
      imgsArrangeArr[i] = {
        pos : {
          top : _this.getRangeRandom( hPosRangeY[0],hPosRangeY[1]),
          left : _this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate : _this.get30DegRandom(),
        isCenter: false,
      }

    };

    // 如果布局了上侧图片，就将图片在塞获取
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    //将中心图片塞回去
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    _this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
    console.log(imgsArrangeArr);
  };


  render() {

    var controllerUnits = [],
         imgFigures = [];
    imageDatas.forEach(function (value,index) {

      if( !this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,//图片旋转角度
          isInverse: false,//图片正反面
          isCenter: false
        };
      }

      imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index] } inverse={this.inverse(index)} center={this.center(index)}/>);
      controllerUnits.push(<ControllerUnit  arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
    }.bind(this))

    return (
      <section className="stage"  ref="stage">
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
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {   // 水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {    // 垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  }
};

export default AppComponent;
