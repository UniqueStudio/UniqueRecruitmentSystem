import { createStyles, Theme } from '@material-ui/core/styles';
import combineStyles from '../utils/combindStyles';
import borderStyles from './Border';
import fontStyles from './Font';
import heightStyles from './Height';
import CustomTheme from './theme';

const {
    palette: { primary }
} = CustomTheme;

const style = ({ breakpoints, spacing }: Theme) =>
    createStyles({
        root: {
            position: 'relative'
        },
        container: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: spacing(4, 12),
            '& > div': {
                width: '100%'
            },
            [breakpoints.down('md')]: {
                padding: spacing(2, 4)
            },
            [breakpoints.down('sm')]: {
                padding: spacing(2, 3)
            },
            [breakpoints.down('xs')]: {
                width: 'fit-content',
                padding: spacing(2, 0),
                margin: '0 auto',
                alignItems: 'center',
                '& > div': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: spacing(3, 0),
                    width: '100%',
                    '& .button': {
                        width: '35vw'
                    },
                    '&.mobile-select': {
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: spacing(0),
                        '& > div': {
                            margin: spacing(3, 0),
                            width: '50vw'
                        }
                    },
                    '&.mobile-submit': {
                        '& > div': {
                            margin: '0 auto'
                        }
                    }
                }
            }
        },
        resume: {
            fontWeight: 700
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
                    },
                    [breakpoints.down('md')]: {
                        height: '106px'
                    },
                    [breakpoints.down('sm')]: {
                        height: '86px'
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
                        width: '7vw',
                        [breakpoints.down('md')]: {
                            width: '10vw'
                        }
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
            margin: spacing(1, 0),
            '& > div': {
                width: '10vw',
                [breakpoints.down('md')]: {
                    width: '14vw'
                }
            }
        },
        partFour: {
            display: 'flex',
            justifyContent: 'space-between',
            margin: spacing(2, 0),
            [breakpoints.down('md')]: {
                margin: spacing(1, 0)
            },
            '& .pfLeft': {
                width: 'calc(30vw + ( 100% - 40vw ) * 2 / 3)',
                [breakpoints.down('md')]: {
                    width: 'calc(42vw + ( 100% - 56vw ) * 2 / 3)'
                }
            },
            '& .pfRight': {
                display: 'flex',
                flexDirection: 'column',
                '& > div, > button': {
                    margin: spacing(1, 0),
                    width: '10vw',
                    [breakpoints.down('md')]: {
                        width: '14vw'
                    }
                }
            },
            '& .submit': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& .button': {
                    width: '10vw',
                    [breakpoints.down('md')]: {
                        width: '14vw'
                    }
                }
            }
        },
        curtain: {
            opacity: 0.2
        }
    });

const styles = combineStyles(borderStyles, fontStyles, heightStyles, style);

export default styles;
