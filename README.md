## 踩坑

### findOneBy

```ts
const foundUser = await this.userRepository.findOneBy({
  username: loginDto.username,
});
```

如果findOneBy给了一个undefined的值，会从数据库里面找到第一个条数据，所以一定要进行undefined拦截
