import React, { MouseEvent, MouseEventHandler, PureComponent } from 'react';

import Chart, { ChartData, ChartOptions } from 'chart.js';

interface ChartDoughnut extends Chart {
    getElementsAtEvent: (event: MouseEvent) => ChartElement[];
    _hiddenIndices: {};
}

interface ChartElement {
    index: number;
}

export interface ChartComponentProps {
    data: ChartData;
    height: number;
    width: number;
    options: ChartOptions;
    handleClick: (event: MouseEvent, chart: ChartDoughnut) => void;
}

export class Doughnut extends PureComponent<ChartComponentProps> {

    chart!: Chart;
    element!: HTMLCanvasElement;

    componentDidMount() {
        const { options, data } = this.props;
        this.chart = new Chart(this.element, { type: 'pie', data, options });
    }

    componentDidUpdate() {
        const { options, data: { datasets, labels } } = this.props;
        const currentDatasets = this.chart.config.data?.datasets;

        if (!datasets || !currentDatasets) {
            return;
        }
        this.chart.options = { ...this.chart.options, ...options };

        this.chart.config.data = {
            datasets: datasets.map((next, i) => ({ ...currentDatasets[i], ...next })),
            labels
        };

        this.chart.update();
    }

    componentWillUnmount() {
        this.chart.destroy();
    }

    handleClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
        this.props.handleClick(event, this.chart as ChartDoughnut);
    };

    ref = (element: HTMLCanvasElement) => {
        this.element = element;
    };

    render() {
        const { height, width } = this.props;
        return <canvas ref={this.ref} height={height} width={width} onClick={this.handleClick} />;
    }
}
