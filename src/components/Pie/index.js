import React, { memo } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

const Pie = memo(({ data }) => {
    const option = {
        legend: {
            top: 'bottom'
        },
        stillShowZeroSum: false,
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
            {
                name: 'Nightingale Chart',
                type: 'pie',
                radius: [50, 250],
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                data: data
            }
        ]
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

export default Pie;
