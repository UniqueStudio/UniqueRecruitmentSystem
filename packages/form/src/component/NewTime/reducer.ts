export type ClickedArray = Array<boolean | undefined>;

interface IState {
  clicked: ClickedArray;
}
export const initialState: IState = { clicked: [] };

export const reducer = (state: IState, action: number) => {
  state.clicked[action] = !state.clicked[action];
  return { clicked: state.clicked };
};
