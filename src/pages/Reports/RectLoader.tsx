import React from 'react';
import ContentLoader from 'react-content-loader';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    isNormalized?: boolean;
}

const RectLoader: React.FC<Props> = ({className, isNormalized = true, style = { width: '100%', height: '100%'}}) => (
    <ContentLoader
        className={className}
        speed={1}
        viewBox={isNormalized? "0 0 100 10": ""} // Normalized to a 100x20 grid
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        style={style} // Ensures it adapts to parent
    >
        <rect x="0" y="0" rx="0" ry="0"
              width="100%"
              height="100%"
        />
    </ContentLoader>
);

export default RectLoader;
