# ipfs-api-test

ipfs 노드를 운영 및 활용하여 ipfs에서 제공하는 기능을 Test 합니다.

## DAG API

- 유일한 Primitive Data Structure를 사용하는 API
- 일반적인 상황에 대한 유연한 접근을 하기에는 부족함

## Files API

- use case에 따라 커스텀하여 사용 가능한 API
  - Regular Files API
  - Mutable File System
- Content Address 에서는 파일 하나의 변경이, 종속된 모든 파일의 새로운 변경이 됨

### Regular Files API

- cat
- add & addAll
- ls
- get

### Mutable File System

- chmod
- cp
- mkdir
- stat
- touch
- rm
- read
- write
- mv
- flush
- ls

## Implementation
| Regular Files API | Mutable Files API |
|:---:|:---:|
| ![regular](https://github.com/MoSangIl/ipfs-api-test/assets/45113627/546a25d7-dea7-432e-b6fc-63acd41d3b97) | ![mutable](https://github.com/MoSangIl/ipfs-api-test/assets/45113627/68bb05bd-ebbf-4953-b719-6282d43e76d0)

## Reference

- https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#the-regular-api
