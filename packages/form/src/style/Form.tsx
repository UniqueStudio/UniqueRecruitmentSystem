import { createStyles, Theme } from '@material-ui/core/styles';
import combineStyles from '../utils/combindStyles';
import borderStyles from './Border';
import fontStyles from './Font';
import CustomTheme from './theme';

const {
    palette: { primary }
} = CustomTheme;

const style = ({ breakpoints, spacing }: Theme) =>
    createStyles({
        root: {},
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: spacing(4, 12),
            '& > div': {
                height: 'fit-content',
                width: '100%'
            },
            [breakpoints.down('lg')]: {
                padding: spacing(4, 6)
            }
        },
        resume: {
            fontWeight: 700,
            height: '100%'
        },
        partOne: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: spacing(1, 0)
        },
        partTwo: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .ptLeft': {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                '& > div': {
                    margin: spacing(1, 0)
                }
            },
            '& .ptMid': {
                '@media screen and (max-width: 1600px)': {
                    height: '116px',
                    backgroundColor: primary.light,
                    borderRadius: '1.5px',
                    width: '3px',
                    '@media screen and (max-width: 1440px)': {
                        height: '96px'
                    }
                },
                '& img': {
                    width: '100px',
                    '@media screen and (max-width: 1600px)': {
                        display: 'none'
                    }
                }
            },
            '& .ptRight': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                '& .codeBar': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    '& .button': {
                        width: '7vw'
                    }
                },
                '& > div': {
                    margin: spacing(1, 0)
                }
            }
        },
        partThree: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: spacing(1, 0)
        },
        partFour: {
            display: 'flex',
            justifyContent: 'space-between',
            margin: spacing(2, 0),
            '& .pfLeft': {
                width: 'calc(30vw + ( 100% - 40vw ) * 2 / 3)'
            },
            '& .pfRight': {
                width: '10vw',
                display: 'flex',
                flexDirection: 'column',
                '& > div,button': {
                    margin: spacing(1, 0),
                    width: '10vw',
                    height: '50px',
                    '@media screen and (max-width: 1440px)': {
                        height: '40px'
                    }
                }
            },
            '& .submit': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        }
    });

const styles = combineStyles(borderStyles, fontStyles, style);

export default styles;
