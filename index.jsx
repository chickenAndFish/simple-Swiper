/**
 * 基于 Reach Hook 及 CSS 属性 transform: translate(); 的简易 Swiper(仅适用于移动端, 若用于 PC 端请作修改)
 * 本 jsx 文件稍作改动即可模块化使用, 可转移部分 style 样式至 CSS 文件, 不转不影响直接使用此 jsx 文件模块化
 */

const { useState, useEffect, useRef } = React;

/* 组件子项 */
function SwiperItem(props) {
  return (
    <div className='Swiper-item' style={{ width: '100%', height: '100%' }}>
      {props.children}
    </div>
  );
}

/* 组件主体项 */
function Swiper(props) {
  /* ---初始数据部分--- */
  const direction = props.direction || 'X';
  const itemIndex = props.itemIndex || 0;
  const width = props.width || '100vw';
  const height = props.height || '100vh';
  const containerEl = useRef();
  const [currentIndex, setCurrentIndex] = useState(itemIndex);
  const [currentElSize, setCurrentElSize] = useState({ width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState(0);
  const [movePoint, setMovePoint] = useState(0);
  const [endPoint, setEndPoint] = useState(0);
  const [distance, setDistance] = useState(0); // 触摸移动距离
  const [isMoving, setIsMoving] = useState(false); // 是否触发移动

  // 组件渲染后偏移至默认页
  useEffect(() => {
    const { clientWidth, clientHeight } = containerEl.current;
    setCurrentElSize({ width: clientWidth, height: clientHeight });
    setIsMoving(true); // 手动触发，使页面默认偏移
  }, []);

  // 每次触摸结束偏移完页面后即执行，暴露了滑动后的当前页 currentIndex 与设置当前页函数 setCurrentIndex
  useEffect(() => {
    const callBack = props.changed;
    callBack({ currentIndex, setCurrentIndex });
  }, [endPoint]);

  /* ---工具函数部分--- */
  /**
   * 触摸距离达到阈值时获取触摸移动方向, 默认阈值 64px
   * @param {number} start 触摸开始位置 startPoint
   * @param {number} end 触摸结束位置 endPoint
   * @return {string} 返回将要划向的方向, 为 'toNext' 或 'toPrev'
   */
  const touchDirection = (start, end) => {
    const distan = start - end;
    const threshold = props.threshold || 64;
    if (distan > threshold) return 'toNext';
    if (distan < -threshold) return 'toPrev';
  };

  /**
   * 滑动距离达到阈值时更新当前页并防止偏移出容器
   * @param {number} start 触摸开始位置 startPoint
   * @param {number} end 触摸结束位置 endPoint
   */
  const indexLimit = (start, end) => {
    const goTo = touchDirection(start, end);
    const itemStartIndex = 0;
    const itemEndIndex = props.children.length - 1;
    switch (goTo) {
      case 'toPrev':
        setCurrentIndex(
          currentIndex === itemStartIndex ? itemStartIndex : currentIndex - 1
        );
        break;
      case 'toNext':
        setCurrentIndex(
          currentIndex === itemEndIndex ? itemEndIndex : currentIndex + 1
        );
        break;
    }
  };

  /**
   * 对过渡部分的偏移进行限制，防止偏移出容器
   * @param {number} distan 原始滑动距离
   * @return {number} 返回安全滑动距离
   */
  const translatePart = distan => {
    const itemStartIndex = 0;
    const itemEndIndex = props.children.length - 1;
    if (currentIndex === itemStartIndex && distan > 0) {
      return 0;
    }
    if (currentIndex === itemEndIndex && distan < 0) {
      return 0;
    }
    return distan;
  };

  /**
   * 获取偏移当前整页的距离数值
   * @param {string} direct 判断是横向滑动还是纵向滑动
   * @param {number} distan 过渡时已滑动的距离
   * @return {number} 返回滑动整页的距离
   */
  const translatePage = (direct, distan) => {
    switch (direct) {
      case 'X':
        return isMoving
          ? -(currentIndex * currentElSize.width) + distan
          : -(currentIndex * currentElSize.width);
      case 'Y':
        return isMoving
          ? -(currentIndex * currentElSize.height) + distan
          : -(currentIndex * (currentElSize.height || height));
    }
  };

  /* ---事件处理函数部分--- */
  /* 处理 'X', 'Y' 对应的触摸事件 */
  const touchStartX = e => {
    const point = e.changedTouches[0].clientX;
    setIsMoving(true);
    setStartPoint(point);
    setCurrentElSize({
      width: e.target.clientWidth,
      height: e.target.clientHeight,
    });
    return;
  };
  const touchStartY = e => {
    const point = e.changedTouches[0].clientY;
    setIsMoving(true);
    setStartPoint(point);
    setCurrentElSize({
      width: e.target.clientWidth,
      height: e.target.clientHeight,
    });
    return;
  };
  const touchMoveX = e => {
    const point = e.changedTouches[0].clientX;
    const distan = translatePart(point - startPoint);
    setMovePoint(point);
    setDistance(distan);
    return;
  };
  const touchMoveY = e => {
    const point = e.changedTouches[0].clientY;
    const distan = translatePart(point - startPoint);
    setMovePoint(point);
    setDistance(distan);
    return;
  };
  const touchEndX = e => {
    const point = e.changedTouches[0].clientX;
    indexLimit(startPoint, point);
    setIsMoving(false);
    setEndPoint(point);
    setDistance(0);
    return;
  };
  const touchEndY = e => {
    const point = e.changedTouches[0].clientY;
    indexLimit(startPoint, point);
    setIsMoving(false);
    setEndPoint(point);
    setDistance(0);
    return;
  };

  // 触摸开始时触发事件
  const onTouchStart = e => {
    e.stopPropagation();
    if (direction === 'X') touchStartX(e);
    if (direction === 'Y') touchStartY(e);
  };
  // 触摸移动时触发事件
  const onTouchMove = e => {
    e.stopPropagation();
    if (direction === 'X') touchMoveX(e);
    if (direction === 'Y') touchMoveY(e);
  };
  // 触摸结束时触发事件
  const onTouchEnd = e => {
    e.stopPropagation();
    if (direction === 'X') touchEndX(e);
    if (direction === 'Y') touchEndY(e);
  };

  /* ---组件渲染部分--- */
  return (
    <div
      className='Swiper-container'
      style={{ width: width, height: height, overflow: 'hidden' }}
      ref={containerEl}
    >
      <div
        className='Swiper-wrapper'
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display: 'flex',
          flexDirection: props.direction === 'X' ? 'row' : 'column',
          width: direction === 'X' ? `${props.children.length}00%` : '100%',
          height: direction === 'X' ? '100%' : `${props.children.length}00%`,
          transform: `translate(${
            direction === 'X' ? translatePage(direction, distance) : 0
          }px,${direction === 'Y' ? translatePage(direction, distance) : 0}px)`,
          transition: isMoving ? '' : `0.3s transform linear`,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

// ReactDOM 组件渲染
ReactDOM.render(
  <React.StrictMode>
    <Swiper
      direction='X'
      width='100vw'
      height='100vh'
      threshold={64}
      itemIndex={0}
      changed={e => {
        console.log(e);
      }}
    >
      <SwiperItem>
        <div>
          I'm the first page.
          <br />
          试试左右滑动
        </div>
      </SwiperItem>
      <SwiperItem>
        <div>
          I'm the second page.
          <br />
          试试左右滑动
        </div>
      </SwiperItem>
      <SwiperItem>
        <div>
          I'm the third page.
          <br />
          试试左右滑动
        </div>
      </SwiperItem>
    </Swiper>
  </React.StrictMode>,
  document.querySelector('#root')
);
