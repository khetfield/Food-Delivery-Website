# Super Treats

Super Treats is a solo project build as the capstone project at App Academy, the
culmination of 6 months of focused study on fullstack developement. Super Treats
is an eCommerce site for food. Hungry users can browse food options and place
orders, while business focused users can register their restaurants and menus to
create a new source of income. The live site is available @ https://super-treats.onrender.com

For more details on features and application architecture see our wiki:

- [Features List](https://github.com/Somorovd/appacademy-super-treats-capstone/wiki/Feature-List)
- [User Stories](https://github.com/Somorovd/appacademy-super-treats-capstone/wiki/User-Stories)
- [Database and Endpoints](https://github.com/Somorovd/appacademy-super-treats-capstone/wiki/Database-and-Endpoints)
- [Redux Store Shape](https://github.com/Somorovd/appacademy-super-treats-capstone/wiki/Redux-Store-Shape)
- [React Components](https://github.com/Somorovd/appacademy-super-treats-capstone/wiki/React-Components)

## Tech and Languages

- React
- Redux
- Flask
- SQLAlchemy
- Javascript
- Python
- Postgres
- CSS
- HTML

## How to Build

In the root directory:

```bash
  pipenv install -r requirements.txt &&
  pipenv shell &&
  cp .env.example .env &&
  flask db upgrade &&
  flask seed all &&
  flask run
```

In a second terminal:

```bash
  cd react-app &&
  npm install &&
  npm start
```

In your browser, navigate to http://localhost:3000/

## Screenshots

![image](https://github.com/Somorovd/appacademy-super-treats-capstone/assets/18534469/c9de766c-4b0d-40fe-affd-8a5d9a8f7241)
![image](https://github.com/Somorovd/appacademy-super-treats-capstone/assets/18534469/fde866b5-32bf-47d0-9745-b1c90b1b3473)
![image](https://github.com/Somorovd/appacademy-super-treats-capstone/assets/18534469/7c790b16-c260-4d19-a37d-c286cf40de22)
![image](https://github.com/Somorovd/appacademy-super-treats-capstone/assets/18534469/8ee9fc22-a358-492e-8bfd-831731ca50f8)
![image](https://github.com/Somorovd/appacademy-super-treats-capstone/assets/18534469/0e8d2952-6c84-4723-9f36-d08a0450e059)
![image](https://github.com/Somorovd/appacademy-super-treats-capstone/assets/18534469/7710382c-1b38-4b46-bda0-6f24ca79cf6d)
![image](https://github.com/Somorovd/appacademy-super-treats-capstone/assets/18534469/9e0477c2-6360-402f-9eef-972b79688751)

## Future Features

1. Search and filter for businesses and items
2. Allow business owners to create multiple menus and split items by category
3. Connect a map API to show locations and estimate delivery times
4. Create a system that allows users to customize their orders i.e. portion size and toppings

## Code I Found Interesting

### Multi-stage Forms
This was my first time implementing a multistage form and I though my solution was pretty neat. Each stage of the form was 
turned into a separate component, such as SignupFormEmail, that handled any related logic. The main form component, SignupFormPage, kept the state
and handled the rendering. The code below shows a simplified version of the relevant code.

```javascript

/* /react-app/src/components/auth/SignupFormPage/SignupFormPage.js */

import SignupFormEmail from "./SignupFormEmail";

export default function SignupFormPage() {
  const [email, setEmail] = useState(""); 
	const [step, setStep] = useState(0);

	const formSteps = [    
  	SignupFormEmail,
  ];
  
  const nextStep = () => {
    if (step < formSteps.length - 1) 
      setStep((step) => step + 1);
    else handleSubmit();
  };

  const CurrentStep = formSteps[step];

  const formData = {
    email: {email, setEmail},
    steps: { nextStep }
  }

  return (
    <form>
      <CurrentStep formData={formData}/>
    </form>
  )
}
```


```javascript
/* /react-app/src/components/auth/SignupFormPage/SignupFormEmail.js */

export default function SignupFormEmail({ formData }) {
  const { email, setEmail } = formData.email;
  const { nextStep } = formData.steps;

  const submitEmail = async (e) => {
    e.preventDefault();
    const res = await dispatch(validateEmail(email)); // check for uniqueness on the backend
    if (!res.errors) nextStep();
    // else handle errors
  }

  return (
    <section>
      <input
        value={email}
        onChange={setEmail}
      />
      <button onClick={submitEmail}>
        Submit Email
      </button> 
    </section>
  )
}
```

### Separating Image and Non-Image Cards
When browsing items in a restaurant's menu, item cards are displayed in a flex container up to 4 in a row for cards with images, and up to 2 in a row without. 
If there are not enough to fill a row, there is still a separation between images and non-images. 
![image](https://github.com/Somorovd/appacademy-super-treats-capstone/assets/18534469/ce39486f-5210-490f-8053-407266ab7a92)

Each item card is an individual component that does not know about its siblings. The page that they are rendered on only passes in an item id as a prop, so there is no way to split or sort the items. 
Instead I have a useEffect the utilizes css classes and DOM manipulation to insert a spacer element where required. 

```javascript
/* /react-app/src/components/ItemBrowsingPage/ItemBrowsingPage.js */
  useEffect(() => {
    const firstNonPicElement = document.querySelectorAll(
      ".item-card--image+.item-card--no-image"
    );

    for (let ele of firstNonPicElement) {
      const spacer = document.createElement("div");
      spacer.classList.add("flex-spacer");
      ele.parentNode.insertBefore(spacer, ele);
    }
  });
```
