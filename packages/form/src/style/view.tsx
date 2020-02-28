import { createStyles, Theme } from '@material-ui/core/styles';
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
            marginRight: 'calc(100% - 100vw)',
            [breakpoints.down('xs')]: {
                flexDirection: 'column',
                alignItems: 'center'
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
            marginRight: spacing(4),
            backgroundImage: `url(${bgRight})`
        },
        center: {
            flex: 3,
            [breakpoints.down('xs')]: {
                flex: 6
            },
            [breakpoints.down('md')]: {
                flex: 5
            },
            '@media screen and (max-width: 800px)': {
                flex: 6
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: spacing(2),
            marginBottom: spacing(2),
            '& > div': {
                width: '100%',
                height: 'auto'
            }
        },
        header: {
            width: '70%',
            [breakpoints.down('sm')]: {
                width: '80%'
            }
        },
        msg: {
            userSelect: 'none',
            fontFamily: MyTheme.font.special,
            fontSize: '20px',
            margin: `${spacing(1)}px 0`,
            fontWeight: 600,
            [breakpoints.down('xs')]: {
                fontSize: '14px'
            },
            '& .sp': {
                fontFamily: MyTheme.font.special,
                fontSize: '25px',
                fontWeight: 'bold',
                [breakpoints.down('xs')]: {
                    fontSize: '20px'
                }
            },
            '& .sp1': {
                color: MyTheme.palette.primary.main
            },
            '& .sp2': {
                color: MyTheme.palette.secondary.main
            }
        },
        title: {
            textAlign: 'center',
            '& h1': {
                fontFamily: MyTheme.font.special,
                color: MyTheme.palette.secondary.light,
                userSelect: 'none',
                whiteSpace: 'nowrap',
                fontSize: '3vw',
                marginTop: spacing(-1),
                marginBottom: 0,
                [breakpoints.between('sm', 'md')]: {
                    marginTop: spacing(1)
                },
                [breakpoints.down('xs')]: {
                    fontSize: '8vw',
                    marginTop: spacing(2)
                }
            }
        }
    });

export default styles;
