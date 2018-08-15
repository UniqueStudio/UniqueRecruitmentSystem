const css = `
    text-shadow:
        -1px -1px hsl(0, 100%, 50%),
        1px 1px hsl(5.4, 100%, 50%),
        3px 2px hsl(10.8, 100%, 50%),
        5px 3px hsl(16.2, 100%, 50%),
        7px 4px hsl(21.6, 100%, 50%),
        9px 5px hsl(27, 100%, 50%),
        11px 6px hsl(32.4, 100%, 50%),
        13px 7px hsl(37.8, 100%, 50%),
        14px 8px hsl(43.2, 100%, 50%),
        16px 9px hsl(48.6, 100%, 50%),
        18px 10px hsl(54, 100%, 50%),
        20px 11px hsl(59.4, 100%, 50%),
        22px 12px hsl(64.8, 100%, 50%),
        23px 13px hsl(70.2, 100%, 50%),
        25px 14px hsl(75.6, 100%, 50%),
        27px 15px hsl(81, 100%, 50%),
        28px 16px hsl(86.4, 100%, 50%),
        30px 17px hsl(91.8, 100%, 50%),
        32px 18px hsl(97.2, 100%, 50%),
        33px 19px hsl(102.6, 100%, 50%),
        35px 20px hsl(108, 100%, 50%),
        36px 21px hsl(113.4, 100%, 50%),
        38px 22px hsl(118.8, 100%, 50%),
        39px 23px hsl(124.2, 100%, 50%),
        41px 24px hsl(129.6, 100%, 50%),
        42px 25px hsl(135, 100%, 50%),
        43px 26px hsl(140.4, 100%, 50%),
        45px 27px hsl(145.8, 100%, 50%),
        46px 28px hsl(151.2, 100%, 50%),
        47px 29px hsl(156.6, 100%, 50%),
        48px 30px hsl(162, 100%, 50%),
        49px 31px hsl(167.4, 100%, 50%),
        50px 32px hsl(172.8, 100%, 50%),
        51px 33px hsl(178.2, 100%, 50%),
        52px 34px hsl(183.6, 100%, 50%),
        53px 35px hsl(189, 100%, 50%),
        54px 36px hsl(194.4, 100%, 50%),
        55px 37px hsl(199.8, 100%, 50%),
        55px 38px hsl(205.2, 100%, 50%),
        56px 39px hsl(210.6, 100%, 50%),
        57px 40px hsl(216, 100%, 50%),
        57px 41px hsl(221.4, 100%, 50%),
        58px 42px hsl(226.8, 100%, 50%),
        58px 43px hsl(232.2, 100%, 50%),
        58px 44px hsl(237.6, 100%, 50%),
        59px 45px hsl(243, 100%, 50%),
        59px 46px hsl(248.4, 100%, 50%),
        59px 47px hsl(253.8, 100%, 50%),
        59px 48px hsl(259.2, 100%, 50%),
        59px 49px hsl(264.6, 100%, 50%),
        60px 50px hsl(270, 100%, 50%);
    font-size: 60px;
    padding: 0 60px 60px 0;
`;

const logger = () => setTimeout(
    console.log.bind(
        console,
        `%cUnique Studio`,
        css,
        '\n欢迎报名联创团队web组！'
    )
);

export { logger };