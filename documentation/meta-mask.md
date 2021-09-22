# MetaMask (and co) pitfalls

The main problem is documentation and sample code can't keep up with changes of MetaMask and Ethereum-related standards.

- Some sample code uses convenience libraries that won't work anymore (outdated and abandoned).
- Some sample code is outdated itself (uses pieces of API that are already deprecated).
- Some documentation is outdated similarly.

(Also, 3rd-party tutorials are outdated but it's not a big deal in comparison to 3 above because everybody is used to it and expects it.)

## Gotchas

### Extension Provider

To connect and get the account one is supposed to use `eth_requestAccounts` now.
And yet Extension Provider sample uses Eth that doesn't have it.
Didn't check but probably also it's based on deprecated web3 and thus won't work.

### Documentation

- The documentation has `eth_accounts` in sample code without any hint on that
either it should be replaced with `eth_requestAccounts` or used after `connect`.
- Sample code in documentation often uses `sendAsync()` but it's deprecated (replaced by `request()`).
- Usage example on metamask-extension-provider is technically possible to follow but it's too hard to integrate this approach neatly anywhere.
  It's much better to follow extension sample code from that repo instead.

### Errors (lack of them)

Using `eth_accounts` without connection fails silently, no error, no nothing.

### Rotten sample code

The documentation recommends [Sign examples](https://github.dev/danfinlay/js-eth-personal-sign-examples)
and yet it uses deprecated __web3__ and thus no longer work.

### Bugs

Promise returned by `request()` with `eth_sign` method is never resolved. (However, it is rejected on cancel just fine.)

### Breaking changes

The method `eth_sign` changed its behaviour completely.
Some documentation or samples or convenience libraries may still rely on old implementation.
Though it doesn't matter, see the first bug in Bugs section.

### Other

#### Why `signTypedData_v4` was chosen?

Since `eth_sign` doesn't work (see Bugs) then will it be easier to prototype using `personal_sign` or `signTypedData_v`?
At first, it seems like `personal_sign` is supposed to be easier but `signTypedData_v` seem to be much less of a huge mess.
MetaMask specifically seem to push for just forgetting the former's mess.
Anyway, they seems to equally easy/hard/unknown.
And if they are equal then it's best to prefer the latest "stable" (relatively) method, or even just the latest.

## Conclusion

- Extension Provider is useless is a library because it's outdated. Still can be used as if it's a pseudo-code example.
- As hinted in the documentation, convenience libraries are not needed. It's probably best to use `request()` provided by the unwrapped provider directly.
- Sign examples still can be as if they are pseudo-code examples.
