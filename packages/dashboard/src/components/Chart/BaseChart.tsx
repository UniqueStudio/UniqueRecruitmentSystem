import {
    ArcElement,
    BarController,
    BarElement,
    BubbleController,
    CategoryScale,
    Chart,
    ChartConfiguration,
    ChartType,
    DefaultDataPoint,
    DoughnutController,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    LogarithmicScale,
    PieController,
    PointElement,
    PolarAreaController,
    RadarController,
    RadialLinearScale,
    ScatterController,
    TimeScale,
    TimeSeriesScale,
    Title,
    Tooltip,
} from 'chart.js';
import React, { useEffect, useRef } from 'react';

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Filler,
    Legend,
    Title,
    Tooltip,
);

interface Props<TType extends ChartType = ChartType, TData = DefaultDataPoint<TType>, TLabel = unknown>
    extends ChartConfiguration<TType, TData, TLabel> {
    width?: number;
    height?: number;
}

export const BaseChart = <TType extends ChartType = ChartType, TData = DefaultDataPoint<TType>, TLabel = unknown>({
    type,
    data,
    options,
    plugins,
    height,
    width,
}: Props<TType, TData, TLabel>) => {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const item = canvas.current?.getContext('2d');
        const chart =
            item &&
            new Chart(item, {
                type,
                data,
                options,
                plugins,
            });
        return () => chart?.destroy();
    });
    return <canvas ref={canvas} height={height} width={width} />;
};
