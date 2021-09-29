import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';

import { Modal } from '@components/Modal';
import { useStores } from '@hooks/useStores';

export const Suggestion: FC = observer(() => {
    const { $component } = useStores();
    return (
        <Modal title='面试问题提示' open={$component.suggestionOpen} onClose={() => $component.toggleSuggestion()}>
            <Box m={2}>
                当你想不出什么问题的时候，不妨参照这里：
                <br />
                <ul>
                    <li>简单介绍一下你自己</li>
                    <li>请评价一下你的熬测</li>
                    <li>熬测之后你又学/看了什么</li>
                    <li>未来规划</li>
                    <li>个人优缺点</li>
                    <li>你对我们团队了解有多少</li>
                    <li>你为什么选择来我们团队</li>
                    <li>对本组的理解（为什么选择xx组，为什么不选择xx组）</li>
                    <li>40小时打卡</li>
                    <li>加入团队后，你能为我们带来什么</li>
                    <li>没能加入团队的话，你有什么打算</li>
                    <li>
                        考察合作意识（围绕各组合作展开）
                        <ul>
                            <li>design提出的不喜欢的设计（web、android、iOS）</li>
                            <li>pm提出的不合理的需求（web、android、iOS、design）</li>
                            <li>合作对方咕咕咕</li>
                        </ul>
                    </li>
                    <li>考察责任感（如紧急项目、ddl）</li>
                    <li>面对全新的知识领域，如何学习</li>
                    <li>评价业界相关现象（对程序员这个职业的看法，前端娱乐圈，996，etc.）</li>
                    <li>如何看待室友、同学他们的学习</li>
                    <li>你想作为技术管理者还是技术专家</li>
                    <li>团队风气（如互膜）</li>
                    <li>你有什么问题要问我们吗</li>
                </ul>
            </Box>
        </Modal>
    );
});
