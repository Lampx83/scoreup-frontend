const buttonSignup = document.querySelector('.form-button')

const inputs = document.querySelectorAll('input')
for (const input of inputs) {

  //! alert invalid
  input.addEventListener('focusout', () => {
    const parent = input.closest('.group-input')

    if (input.value === '') {
      parent.classList.add('invalid')
      parent.setAttribute('data-error', 'Vui lòng không để trống trường này!')
    }

  })
  //! end alert invalid

  input.addEventListener('change', () => {
    const parent = input.closest('.group-input')

    // !check username
    if (input.id === 'username') {
      const usernameRegex = /^[a-zA-Z0-9]{6,30}$/
      if (!usernameRegex.test(input.value)) {
        parent.classList.add('invalid')
        parent.setAttribute('data-error', 'Tên đăng nhập không hợp lệ!(tối thiểu 6 ký tự, tối đa 30 ký tự)')
      } else {
        parent.classList.remove('invalid')
      }
    }
    // !end check username

    // !check password
    if (input.id === 'password') {
      const passwordRegex = /^[a-zA-Z\d]{8,}$/
      if (!passwordRegex.test(input.value)) {
        parent.classList.add('invalid')
        parent.setAttribute('data-error', 'Mật khẩu không hợp lệ! (tối thiểu 8 ký tự)')
      } else {
        parent.classList.remove('invalid')
      }
    }
    // !end check password

    // !check full input
    let isOk = true
    for (const item of inputs) {
      if (item.closest('.group-input').classList.contains('invalid')) {
        isOk = false
        console.log(item)
        break
      }
    }
    // !end check full input
    if (isOk) {
      buttonSignup.classList.remove('disabled')
    } else {
      buttonSignup.classList.add('disabled')
    }
  })
}