# demo-handwired

<img width="1280" height="720" alt="youtube_thumbnail" src="https://github.com/user-attachments/assets/0152441f-3e00-4b3e-b6a0-1512fad27685" />

[handwired](https://github.com/chenglou/handwired)로 만든 탭 선택기입니다. 탭을 누르는 판단과 밑줄 위치를 가중합과 ReLU만으로 계산합니다.

```bash
git clone --recurse-submodules https://github.com/skyfe79/demo-handwired.git
cd demo-handwired
bun install
bun run start   # http://localhost:3000/
bun run test
bun run check
```

- `tabs/tabs.ts` — 셀 선언, 빌더 코드, 호스트, 페이지
- `tabs/tabs-reference.ts` — 같은 탭 선택기를 평범한 JavaScript로
- `tabs/tabs.test.ts` — 두 버전 비교
