import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ breakpoints }: Theme) =>
    createStyles({
        height: {
            height: '50px',
            '@media screen and (max-width: 1440px)': {
                height: '40px'
            },
            [breakpoints.down('md')]: {
                height: '45px'
            },
            [breakpoints.down('sm')]: {
                height: '35px'
            },
            [breakpoints.down('xs')]: {
                height: '40px'
            }
        }
    });

export default styles;
