import React from 'react';

export type AdsterraBannerType =
  | '728x90'
  | '468x60'
  | '320x50'
  | '300x250'
  | '160x600'
  | '160x300';

interface AdConfig {
  key: string;
  width: number;
  height: number;
  id: string;
}

export const AD_CONFIGS: Record<AdsterraBannerType, AdConfig> = {
  '728x90': {
    key: 'f0537505c3a02ffa4a138dbf2cf50419',
    width: 728,
    height: 90,
    id: '728x90_1 (31592556)',
  },
  '468x60': {
    key: 'a5f7588d93600207c48475df8a3bbdae',
    width: 468,
    height: 60,
    id: '468x60_1 (31592553)',
  },
  '320x50': {
    key: '0db1f29f16c01284b9a5fa9a85fe7784',
    width: 320,
    height: 50,
    id: '320x50_1 (31592555)',
  },
  '300x250': {
    key: '33f40cc5cad6fa4ca374973e0e864019',
    width: 300,
    height: 250,
    id: '300x250_1 (31592558)',
  },
  '160x600': {
    key: 'e555ff6aa1925aaf05add455e73b852b',
    width: 160,
    height: 600,
    id: '160x600_1 (31592557)',
  },
  '160x300': {
    key: '83a91f89fb13409900c3423152556e46',
    width: 160,
    height: 300,
    id: '160x300_1 (31592554)',
  },
};

interface AdsterraBannerProps {
  type: AdsterraBannerType;
  className?: string;
  showLabel?: boolean;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({
  type,
  className = '',
  showLabel = true,
}) => {
  const config = AD_CONFIGS[type];

  // Isolated iframe srcDoc to execute Adsterra's script safely in React
  const iframeContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      width: ${config.width}px;
      height: ${config.height}px;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${config.key}',
      'format' : 'iframe',
      'height' : ${config.height},
      'width' : ${config.width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://bicea.org/22/${config.key}"></script>
</body>
</html>`;

  return (
    <div className={`flex flex-col items-center my-4 overflow-hidden ${className}`}>
      {showLabel && (
        <span className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1 font-medium select-none">
          Advertisement
        </span>
      )}
      <div
        className="flex items-center justify-center bg-stone-50/50 dark:bg-stone-900/40 rounded-xl overflow-hidden border border-rose-100/50 dark:border-stone-800 shadow-sm"
        style={{ width: `${config.width}px`, height: `${config.height}px` }}
      >
        <iframe
          title={`Adsterra ${type} Ad`}
          srcDoc={iframeContent}
          width={config.width}
          height={config.height}
          className="border-0 overflow-hidden block"
          scrolling="no"
          style={{ width: `${config.width}px`, height: `${config.height}px` }}
        />
      </div>
    </div>
  );
};
