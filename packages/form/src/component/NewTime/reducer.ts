export type ClickedArray = (boolean | undefined)[];

interface State {
    clicked: ClickedArray;
}
export const initialState: State = { clicked: [] };

export const reducer = (state: State, action: number) => {
    state.clicked[action] = !state.clicked[action];
    return { clicked: state.clicked };
};
