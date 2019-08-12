import React, { MouseEventHandler, PureComponent } from 'react';

import Chart, { ChartData, ChartDataSets, ChartOptions, helpers } from 'chart.js';

type Meta = ReturnType<Chart['getDatasetMeta']>;
type MetaData = Meta['data'][0];

export interface ChartElement extends Omit<MetaData, '_chart'> {
    _chart: {
        data: {
            datasets: (ChartDataSets & { _meta: Meta[] })[];
        };
        id: number;
    };
}

export interface ChartComponentProps {
    data: ChartData;
    height: number;
    width: number;
    options: ChartOptions;
    handleClick: (elements: ChartElement[]) => void;
}

export class Doughnut extends PureComponent<ChartComponentProps> {

    chartInstance!: Chart;
    element!: HTMLCanvasElement;

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    componentWillUnmount() {
        this.destroyChart();
    }

    getCurrentDatasets() {
        return this.chartInstance.config.data!.datasets!;
    }

    updateChart() {
        const { options, data } = this.props;

        this.chartInstance.options = helpers.configMerge(this.chartInstance.options, options);

        const currentDatasets = this.getCurrentDatasets();
        const { datasets, labels } = data;

        this.chartInstance.config.data = { datasets: datasets!.map((next, i) => ({ ...currentDatasets[i], ...next })), labels };

        this.chartInstance.update();
    }

    renderChart() {
        const { options, data } = this.props;
        this.chartInstance = new Chart(this.element, { type: 'pie', data, options });
    }

    destroyChart() {
        this.chartInstance.destroy();
    }

    handleClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
        this.props.handleClick(this.chartInstance.getElementsAtEvent(event) as ChartElement[]);
    };

    ref = (element: HTMLCanvasElement) => {
        this.element = element;
    };

    render() {
        const { height, width } = this.props;
        return <canvas ref={this.ref} height={height} width={width} onClick={this.handleClick} />;
    }
}
