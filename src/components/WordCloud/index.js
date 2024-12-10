import React, { memo } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import 'echarts-wordcloud';

const WordCloud = memo(({data}) => {
  const option = {
    series: [
      {
        type: 'wordCloud',
        gridSize: 8,
        width:'100%',
        height:'100%',
        sizeRange: [30, 80],
        rotationRange: [-90, 90],
        shape: 'pentagon',
        textStyle: {
          normal: {
            color: function() {
              return (
                'rgb(' +
                [
                  Math.round(Math.random() * 255),
                  Math.round(Math.random() * 255),
                  Math.round(Math.random() * 255),
                ].join(',') +
                ')'
              );
            },
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#333',
          },
        },
        data: data,
      },
    ],
  };

  return (
    <div>
      <ReactEcharts
        option={option}
        notMerge
        lazyUpdate
        style={{ height: 800, width: 900 }}
      />
    </div>
  );
});

export default WordCloud;
