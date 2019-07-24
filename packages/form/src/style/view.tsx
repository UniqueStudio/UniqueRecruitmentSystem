import { Theme } from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core/styles';
import bgLeft from '../asset/img/bgLeft.png';
import bgRight from '../asset/img/bgRight.png';
// import borderImg from '../asset/img/test.png';
import MyTheme from './theme';
const styles = ({ spacing, breakpoints }: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            minHeight: '100vh',
            fontFamily: MyTheme.font.family,
            '::-webkit-scrollbar': {
                width: '3px',
                height: '3px'
            },
            '::-webkit-scrollbar-thumb': {
                background: MyTheme.palette.primary.main
            },
            [breakpoints.down('xs')]: {
                flexDirection: 'column',
                alignItems: 'center'
            }
        },
        logo: {
            userSelect: 'none',
            [breakpoints.between('sm', 'md')]: {
                position: 'absolute',
                top: spacing(4),
                left: spacing(6),
                width: '30%'
            },
            [breakpoints.up('lg')]: {
                position: 'absolute',
                top: spacing(3),
                left: spacing(5),
                width: '20%'
            },
            [breakpoints.down('xs')]: {
                width: '50%',
                marginTop: spacing(4)
            }
        },
        background: {
            flex: 1,
            backgroundSize: 'contain',
            backgroundRepeat: 'repeat-Y',
            backgroundPosition: 'bottom',
            marginBottom: spacing(2),
            [breakpoints.down('xs')]: {
                display: 'none'
            }
        },
        bgLeft: {
            marginLeft: spacing(4),
            backgroundImage: `url(${bgLeft})`
        },
        bgRight: {
            marginRight: spacing(3),
            backgroundImage: `url(${bgRight})`
        },
        center: {
            flex: 3,
            [breakpoints.down('xs')]: {
                flex: 6,
                width: '90%'
            },
            [breakpoints.down('md')]: {
                flex: 4
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: spacing(2),
            marginBottom: spacing(2),
            '& > div': {
                width: '100%',
                height: '100%'
            }
        },
        header: {
            width: '80%',
            [breakpoints.down('sm')]: {
                width: '70%'
            }
        },
        msg: {
            fontFamily: MyTheme.font.family,
            fontSize: '1.2rem',
            margin: `${spacing(1)}px 0`,
            fontWeight: 500,
            '& .sp': {
                fontSize: '1.5rem',
                fontWeight: 'bold'
            },
            '& .sp1': {
                color: MyTheme.palette.primary.main
            },
            '& .sp2': {
                color: MyTheme.palette.secondary.main
            }
        }
    });

export default styles;
