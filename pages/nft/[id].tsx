import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useAddress, useDisconnect, useMetamask,useNFTDrop } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import {sanityClient,urlFor} from "../../sanity"
import { Collection } from '../../typings';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import toast, {Toaster} from "react-hot-toast"

interface Props{
collection:Collection
}

function NFTDropPage({collection}:Props) {
    const connectWithMetamask = useMetamask()
    const address = useAddress()
    const disconnect = useDisconnect()
    const[claimedSupply,setClaimedSupply] = useState<number>(0)
    const[totalSupply,setTotalSupply] = useState<BigNumber>()
    const nftDrop = useNFTDrop(collection.address)
    const[loading,setLoading] = useState<boolean>(true)
    const[priceInEth,setPriceInEth] = useState<string>()
const mintNFT = ()=>{
    if(!nftDrop || !address) return
    const quantity = 1;
    setLoading(true)

    const notifiation = toast.loading("Minting...",{
        style:{
            background:"white",
            color:"green",
            fontWeight:"bolder",
            fontSize:"17px",
            padding: "20px"
        }
    })
    nftDrop.claimTo(address,quantity).then(async (tx)=>{
        const receipt = tx[0].receipt
        const claimedTokenId = tx[0].id
        const claimedNFT = tx[0].data

        toast("HOORAY..You Successfully Minted!",{
            duration:8000,
            style:{
                background:"white",
                color:"green",
                fontWeight:"bolder",
                fontSize:"17px",
                padding: "20px"
            }
        })
    }).catch(err=>{
toast("Whoops... Something went wrong!",{
    style:{
        background:"red",
        color:"white",
        fontWeight:"bolder",
        fontSize:"17px",
        padding: "20px"
    }
})
    }).finally(()=>{
        setLoading(false)
        toast.dismiss(notifiation)
    })
}
    useEffect(()=>{
        if(!nftDrop) return;
        const fetchPrice = async()=>{
            const claimedConditions = await nftDrop.claimConditions.getAll()
            setPriceInEth(claimedConditions?.[0].currencyMetadata.displayValue)

        }
        fetchPrice()
    },[nftDrop])

    useEffect(()=>{
        if(!nftDrop) return;
        const fetchNFTDropData = async()=>{
            setLoading(true);
            const claimed = await nftDrop.getAllClaimed()
            const total = await nftDrop.totalSupply()

            setClaimedSupply(claimed.length)
            setTotalSupply(total)
            setLoading(false)
        }

        fetchNFTDropData()
    },[nftDrop])
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
        <Head>
        <title>NFT</title>
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAACIlBMVEUX5rfjyKFnQyL////mnFMa5bQAAAAOCDPQ0NAADDVqRSPpzaXV1dXmy6NgV9YAABsAAC4AACAAACsAACEAACkAABcAACYAABoKADJILxhkQSHsoFUX7r2xjl0AABQAAA3rJBfy9fFYOR3Zv5rrV0vt7e3Ls5A5Muem6szC89yi79Zf6LsiAAAtAAA7JhM0IhF3aVRTNhs6AACrh1SXl5ekkXUtJdvOtZKWhGq2oIGff1LAwMVnJgC8dTCwaSNyTShFIwAivJqDWTAhGhQtHQ5GMiBkRisdCgBlUTVDNiOLeV4zNjpcUUHk5OS9nG5ycnKxsauMjY2yAABaUdfrST1kZmf/OC41LdYoEwAAAMBBPcNaWlTKQUGBZkAzGgBTSjwXAAAfz6c7EQAVg2uWlqOxsrlxcoBGRVUuLT9WVWEUo4cjdmc1PjJwOxmUVyfQhkMlZ1NRIAB4NwBeMgGjbjopTT+RTQbEhkoLU0cyMSgGlHqIRQZIUT0AOTG2e0EeKiqWZzdTEQCBSxg+YU4qIRpESzVaQi5yXD1AQkQ2NVwsKmMiIGoaFnEAAH0AAJIyKpZLQ7VTUnudAACyLSKVHBpGPdbTRD0aFoP7bGJbRUX/LiI/N9YSCpNhLy7PGBVqIyBsAADLKCVtbftERP/mYWJ5ev8AAK5MAAAxL0w0JSoAGx2IaVRHLyeIa1AhQEhIUVOz1M9LiXqdk5pjZHwlI0NrW2GjXocRAAAgAElEQVR4nO2dj18aZ574Bc0TMgMFBNEZEZohsts25UcE+XVBDaCAqLGprVmLhCiCmkaziYl4m9h1WXV7u3ffbbfd7raX7HX328t1dy93G/v/3ed5ZoYfihFhsLGvfF7+Agac93x+P/PMMy2tIOd//NaZH5689ePzGK4Fvt84c6blhyhnzrzBE775w+TDcuZNTPjGDxcQEN9obTn/QwYExPMtP2AbxXLmzZa3vu99aLK81fLDViEo8RXhqZdXhKdfXhGefnlFePrlFeHpl1eEp19eEZ5+eUV4+uUV4emXV4SnX14Rnn55RXj65RXh6ZdXhKdfXhGefnlFePrlFeHpl2YTGo1G/ldT/8uLpHmEhC29tLF8a3b21vLGkAh70tIcQmBJD82t/vLD25dXVtq6u7vbgv90cXluKd1y8pBNIDQa00urv7zz08sYrbutra277d5d58C9lZWV29G59ElrUnJCY8vS2uBP7wdXCBzhuzJ75QFRJHyvfLg+ZCyKtP+6ukhLaGwZWr0EeKC+NoHvATXwoLtIuxIMBn+6vjE3l2edt5aHTsJoJSQE69y49U+At1Lka2u7cq/sQfflYPD23YFHYK8D97rbVm7nN5rvmZIRGo1D64P/XInX1vaonK8tGNxyXnmAFdrd/dEA1uy9rZ8tp5vLKBGh0bj0cIuPmhVSxtd9+Z+3ZgeKG3TfuwJ/Pvpo4CZaN1Z+lBQ7VBKJCJdst/fDVZJ2P7hjG3j0iLtb8tCBRyT2dD/YWipBQaDaXJKUURLC9NrttiP4WO4Rwflo+nJxS7v46odp4YPAk/MXh4wtUjqnJIS3Vl7EB/GUHXggqLj7o8Gg+PSjQeG54DImgki1bPv5Gk6YQ3PSOacEhMaNy4cBkny/4rxS7o9X7gbF3DGwRWqClSAHSksvrd/80DnXkt5YD68PDQ1JQYdFCsKfVeESlHcFvpyVFtztvM0fEYBzBi/f3gIZXF69+PYdipp9uHzzzuBs/heX5qSAIyKFlW7v43tQNMOB7isftXH7+FfswctYdyv3BmwjNxAyb4Yig5ycoriwk6MoxsmyN5elc0TJCbtXrpQBUuB/8Et8kbB337sbXHl0JYyIhCLDAEfJ5XKnncW/KIpl5NMvlx/+ogyg+4HI0/2I6mYf4Ow++Eh4iiWV6eXgtBMJeLFtAkeEK/5FydlNKeCISEE4tyLGSQgbrAgIqHd5tJVZIcbcg6CydXcQyAqxSGR7eHigxFcp1J0NqZQoBeHQbT5yPAAgZ9FcB9q2PhLIt3D50v3gbpBiYvYUkGG7PAxOQLwolZ1K4YfpD3nCj1a6r9wuZoKV+07x78uD2Fptd8OR4aPIisJ+KwEdFkkIozwh1fZgUIwy9x4FS+pcuW/r7uYKwzXC8UocXJVGiZLUNL/klcW1XbkvMg0E2VII7Q7evXclUisfRQ0Pw6bUTWnqUykIjas8yGDboFDddA/cZ9oGirUcNL7m7Zr5mEI+H8Fbvy2JK0pCyIeabmprS6hWHmwNAhYjFDPdbZeZYaoS4zBeajsU98hkcQZvEJIAUBpC4/ojXFhDUR0UPBJHz+6g8wEhvxxknFQZ3bAzEok4OY49AEqxBYeFVslkshR+yK5LoERJssXqrYI8GAzeRjxh96MtEmW67w9ChlwJBrmSiVLD9lAi7nZ7vY5EKjQScZaFH4qK5H20DAsd5/AzUgSbhgmNLes3QRnb4a1gkNoKXiZFzN0rvH0G7w5fDt62FwGp4VDCJ6NpWkXjHzKPL54q2J0UL5GCV6WS8YRu/J4PpUj7jRIa05tQbUGZxdkLzNYIaBLXnTaxTgveh8pMLgBScnvKSgsMRFRAKvPF84VYLFbIe2V08QUfOCJ1R4po2ihhOsTiUtluY5xMxB6aBcSVu+y9j/iR4JUgW5AXFcgV3BV8Ig1Qehy+hIcue44QXir2/g2MrTZIaFwDQMbOscx0qDAdZgpgrPfRg8tQnWK++7ZIycu281a6Eq0ktM8X95XRq6w2IAzxdC1DSxsbS/UOljdGaJyDIAl+xBSS/p6eHn80bA/ZB+92rwyutF0OBllUShIUk6LLRCazeKwen8/ndsMPn9XtjcdlltLrFnxoINAYWzY2Z+/cucPemQ3VZ7ONEaanKcrGygs7PYL4Y9OFwlaw7T63dXfWDB5ICUU2y+Q9QOONOxypVCqfyufzo5ujILu7u6OC5HfhpVQiEcdiZ1nshkuhO+AENrvdzrCX5upBbIjQOAf/nuVGkj19ImJPdJop3A5uQfMXG6Y4zulkbOGRkfzu7rPdqYlJl8uVyQQUCoVSqRwD6S0X/MQYvKDIZGA7V+FmOr12Se60MRw+SKyNuTRUB2JDhOkwqIhBbovFMz7e08djxmxM4S60gKH87gwgPZuavBoIBAhTNVHwsu9ZDF9YSxcGnTbA4xinE/u782EdO9kIIVah3Ia8NB/2VZZxwhhi0OjVgEJJ9KGcmLqq5BHwz8BVQVyTkxMgUy4eUQmPJkGw7q5mrsLbFWOj6wXGzlBMOBbdcThQGOy9nmK8EULihUyqFAJpCyZMhtGoQhTlxOZVgraYffqrj//l17//zW+++td/A/l/WL757YRAOPPOJ4/f+eSddz799NPfffDBB7tXFWO700yYY2KCj/vtLJRxaydKiFXo5Kb5IK+icTmikhE7RchVtL5JhHWovPrNj3i5/lp//2ui9P92RiCceP3x49dB3r1w4fMvvvjiO5dSuQsajCQJHjjAOC7GqbePv5uN6PAiBHQWq1BFW6DQtMogn9NYiQiNTApOppzcJFZ69SvC13/9y2v9n4mAn/V/PCOq+p13MOB7mPDCF+9+NwlqZUZ2MBzQWcANZDGcco4/UFw/oXEDvJCaddMy2udw+KxWr8MBKR0jImRzQoRxQdRUujaJPq/+ngfsv/Zl/7WiCvt/PREQVP3J60SFQAhKfO8PE0rllB1y7LjFwlc9MtrBsPUMUDWgwwJuxMMWGe31YhuF3bB4ofeh/ckYClPDnHObCed387uTmDDwLzzg+6/BlyDX+vt/M3GVJ3T97nXBSC9c+OCLP/5hSqmcAUB3HFqQRMLhBUr3rI3ijp8S6yY0Lt3BRpqgaa+PLoWauC8RT0bRCK5GSa7nBMKPsQ/293/2WclIv+zv/2pCiLSuT4oqvPDBu3/8dyCcSG473FaZzGGRWXwJH20FwsETJGx5iEuxQTdtdZeqTZXFEYcGoS+J2GK/9IwPlx8TwP7X3i+LM0A4IxBe/aSowgsXHr/3BAin4KPA/VRWBw1u6FNZwvaTJDQO3cRamrbSjrJsYU3h4lrl6Yk6i4S7POGvCCAY6ZelOIMJhagb+F2J8N3Hrz+ZAUIP/8l0ihw8mSV0ojqEpgLv/w2Vp9QSqKwJGXlAjycZsSccHuUJs/1YwEiLceb9/v7r/1ok/JMQSS98/vl/PH78p2dgpVaB0EH+UFlHbCcZadKXCEKBdltKJpqSCbQqv01sKoY3ecJn17H8BL5EwY/7MaEyEFAG/vT48eP/+BSS/ad/effx498B4ZRI6CUHkXZPM9TN41emdRKSVAGSoIuAMlXCoirChkVCjidUzgDOj/78df+XX3/9NQH8Bp748/tAqAyENgOgw8fvfvEXIPzLF5D7n2BCwTpoN0/omOWot9NH75tEhMu4huIglJYA3d6yB7EiYZ4nnACbvP6T93/0NS/XrgHvn/98fcYVyGw6RicUf/rj648//wsWMNL3iB/6KnRoidnk8osnVrUZVz8EQhvrKINKlbXvdEIkdOZneML3IR2+dv39a4D3/0G+Br7+69+M7ibibq8jNPrkvT/ieubzzy+AP5JsMVXhh7R70ElxdQy+1a3D/YQkqJcIHWyRcJcQTkJh+tln13/y2jVio9dAo9e/+SrnlvkcqUIqEUL/+eTJvz/5+ZMnT+CPn//BpSgSqvjaPg/9Uz0NYr2EcxwQ2uUlKxVsqfhoUCQsjAqEkAy//Obfvvr9rz/++ONfPc3tzsygpH84HPXLyLiFLzEDWMoxsW8UYyl/6OADKTl7gv2hcQhHGrt8rUToKMUcPFY2S4mEvA6vLi5AB+gizWGAbxgnktFtf48/mYxGo4543OstbE64MsVmeILPh8RIVZ4Rqs5zNY1kC8rGhg4j9ExTYqTZrdbEKxSZCQaFbbEUFJ0+nzXlYJIgDkciMToxSfrjZ/wHWnBJQd/Cka2uU991V20F3Ms4p4sJopJQJrshELKxZ4HyAYsM7PvUTD4PYG6fh/QNUJvRDne4p4fmR8It3hjyer1uQYWgSjo+iJvDeoZp6q9pVvFBtc0WnY+OW8v90H1DLNsiz1wugHr2bHd0E6EQaMzqsRDXU6mK74B3F/rwIeJHT2l3SsYPHqt8XtyegUVQg/VNQambELcWlH0wLpqpylqeDq3ughhMh2O2iM1mi9lDoQLyEjQLQSzXOB335P3YJPHoqQwzCYMjFvgHKkuIlVNcPWGmAcKWNG4PnUyqtKNl2Z92yFIiIWwkygj0WbTVsQ2RJbrjK0dUuS2xPvxi0u9PbmO1OXjrwF5A5/Fn3Th+OdMYITFTymYv2iYUVyV9xukSYRHRhsO+Y7ivB+LnTtLfZymzU48lPK6ix6OxQmHbn3TQUMXTxGhx9TBIUWyo3hPCDXTAuH1gS2YqUznEsAMVajmhnOMJC1Zo8/x42IyfLsRAhhBOx6isPptK5RAmEvkjtMySwKfgrD4VHZ+FPvpG3We8GxjFuEXmaI2UhVCvaKNWFZ3g5GXCgshjcAQsfT1+VJTQjmCMEEvjdEx82p+kVb583B13uC20GwAHH9Z/Sr/BkShQ4kxZgBEA8ehUJSGJqnbshuM7ZYQIpaz8W+MJj6BBe9Q/DnEo5bFaPfik1AgArjUwpbaR8dIQVqLtorcyKlocPjIydoBQzuYtOJjs+KPhEAoVUg6v1R2L8W5oTVkRvM+i4s9M+WIpMgBL+25Q1M3VuvEaJOR7ROd0eVRUuR0eMsq/eZCQ4vLgdzRuKS0eyAE+r5emHaRgp33ehLunzx+FQsAbd6TsbNhCoheYaH2nnKQgBE/kd3y6TIsQUFWk3UcHCeWUM4LyuJaxQsOUR7M4A6pSHhIv3Q5y4iMZQihmgzZiGsIStPWgwcYAGzszw49GyYdnExbx9DUZ26c9EDTYg4RyFgKq6IG2pIXkA1y0yOiQD4o0FS0bBz0WGDkZarakQIMNT6Zt+Pwh5dydnJq9EfeQUWFScnniYa46IQWp0RnJI1TY6RsXDwqurC3IzSdWYOyJRrDxOxyIa1yDDZ/Hf8hyU4qx1kmn057ABafH5/PO2J2UszohViKocTvZNy4r1qRxPCaKPELWATdN2nGQRoy8YR+UgDBdmHa5rra25qHqGJydDYdnBwfBieR2NFINkCDadnogHWCT5AWfmHDbhGrB4gZTiOENw/CRFyWYbtLoXIz0Q3xWs3eGn6FNztizThszi4qDbQcQY8RpVR5v2VCyd1hQoSrqgQiKy6Ww/Oa6FFP3Gp4xNDe5O+FyhYRpTRTndDq5D+/cWrp52Pxmhj8LoBp30H8Xey/aXSQkYxZ56FtG1utqByUnbEn/18TkxI3VtfD07M1Ls9P2cHjtF3NDLUOHEbIpuohyRTzlofKIhPAn7qW2Kcou0aVBjc9rS69urlfM5iFXh27cOUSFpWbESvcUGy6aLbbS5DfYRKTObmm/SDE3scpkJePch9UJubLxR3C6oiMOuMvng9GOmHPw5SGsJsb16kZKRSxlJCqraJt0sqK6VXm+neVebsKWzaqEFFNZppfGafyJyhcca3ckurarSYRpe3XCfJW5iYSwJ1Xxisr38CUnrB5KoUM8jHA85ql4iU7VcSKtqjRpTYWlO9UIhytNsVw8O+5KQrcU9QyWJhEuc3jkYr8Kw5ZDVAjVWtJRSU8XXm7CdRb6COc+PTq9h6pQJvMn9tmt96UmxKNU+FLJSsJUdTYeyB+17ntqTZpdaQ5h+iYmZLgKG7X5XqBClS8Z32em3pekLq0m/Lm3fYRs6gWA2BEj+1631DERsYo0h5CMUVEVhFTo8DBDVJZMuvcp8a+SKLE5hMuscx8h9cIwIyNzcBKVh0BlkeKioCb54RqFLyao0GH+hXxYoklrJSK9LUVp2hzCAstQLMeVCCHMvNBGMY/fvy8lqqwvxXVP1SR9yclBt192vdoLqpkij2fngBJvSbAzzSCEUMqwco4pIxzxHKVCPFWs50DC+P5HoqoKhFJ7JSF3tApxrOlJVs4FkHkkiDVNIVxmEUexTLEwpcJHeiEWi79nX8ClU43HmqYQrnHIRrE2pxhpho8OpIQn7u+rVKIUZtoUwrwThSi5TYw11Ha8BiPFsSbaM17Z6ksQTZsSS9/+xSpiKTvL8PkCn0eqTYlRf8++LVMN70xzCDc2EEPZWBvHT6SN1cSHy+9tf+XBoP/asCM2gzB9MT0EZsqwNjZEIqmjJiPFQLG+v1eeUW7cEZtC+K0xjRDn5GwsPk9KRdw1E7p3KhOGyvd9n12rJsalOaNxDYXBDVlkp2qp2MqUmKzYWOVrONQ0g3BuCL5BieCECIEOYzUUNCKht7IRVlkbzvlNIcRlDUJhJzSFyElRecuhRPsFEka07JFMNb75EhJiMS4hFOIwYfhYhDJVYqAYTVVWqOReRh1iMS7dQDY7RYXBWKlYjekQC5hpsXKjd6y0/2X0QyzGjZuIGZFTdgT1m73mWIr1Fi3mFjpqkSVfxliKBdqLMGODrI8g1vxtp3ZCmWxbGLGiHaoYPT7c8FhN8wgZhgkRQiYSEYNpDdZKJ7Z5t1XFZFZPH/NS1jQthJBlGLuTsaFQyBbqE66cwFP3jiKMOwW39dGWPn/jDWLzCOUMx4QZexjZUWGHbxnwtMy4SlVt+Y8SodvOT+JU0eN9PQMvZ/fUIlznzXJ2W5iBiBMp9PGDpaqYxbLt8R1S4whT12/EfRYyNwpEgoGaphEOUtDiMyGIN3bGVoj2EESVZXuc9qmqEwpPW1Dc57OM9/n9yZ2oBINtzSMkXYUN8TOgkZ/XokrmxpVKdfv0kqWHLMjx920ulnC43T6Po/Fh76YR8mM0eFUELLFCT59HWJSA6Ku4ME2ZxC2WcX/SGUo53B48lRa/OtPwrjRtLgZPyEF/Qabqo4K/Z3wcT88jV8VYrOPj41bPuCA92CTxKigxh9cj4y82wT89f/3eZ+4dJsaHwjgbw4E/AmEEIbwARJ8/ub0ds8eIbMOfEfiO5RMOBzifVbiSBi8iYvV5HYlb6CUdL8XyUDwhg0dqQIscIMaS0Vgi7iPzLC1YPFar1WMhei1eIwSO6HakCggV4IhIkCyaRviteGEXuWwdCJm/4Zn5cbdHAOKZyi59IikQ8FKwXWGbrMrUkzwFhHJirSzjZPH853B0G19lkScLQbg9PFQx5sg8XsCz7/iLCxaxEpxBbDqhwMlQHIOvGIklwROJF0a37SMjhRTJCj6fG9wuBpoT6PCCJh4PJcWCyc0izO+bh8GxgBgh18lESzqCyOPnryFNFuEIndVCy7wpSVbabdasrypThEVErMkoAGHp6fGXFtEiMo5nSFt88b+tL0kzwbRZhBerzYlimYh4MYJ5dXl5eR3Lw7Vbt27lY9Hozt9B4g7HzM/W1vFg1ku0jvBBMQ5dqj77EtQY4hHTlfdiSaeHBEk3tojgAWkW4aGToDkmjwEPXi/ZrHvPNIkQWovqhHgV1mFwx4sSzY89Wpo1r407DJBAyrfrWMKjTmlSpNmsesVMGeOlU06YvvhiwFNPKK5e8wJCiRbrrkGaQ7h+hJHWvXxAHdKcGUNvH7k8OfvwNBO+KFcUlXhR8n97iDRFh1VLtn2EkqzzXIs04/zhxtEqrG+hzrqkGTqsfr3MfiVOn1C+kJ6QrExbg9xpfBitJpGe8MhsLyoxdDJKlJpw9eEmV5MKISWun8hNLKUlNA6ZzzG1AQLi28tzJ3ATS4l1uKktHONeMqH/RstS/veqIimhcc4UOqpeK1ci9+2eoc61kWoXCQmNxjmkZY+hQkAMqdXNDqmSERpbNr41n2s/jpHiQX/tOXOTixtpCPFtZHcDzzTnzukLZNEBEI4I+fMwy6WGzefOdW02N9xIciedlqHViUBr7ygQnmsPRRi7XVj7yonXHxBAK9j4I7Adaod3oLW6711RizR+Pb4xPbeW6e3NPNebDOcwohkYGecBqApAQh3pxNufMxvMpofNu5t1g3fwAOtcm/yfsfmnqKO966yZ7PE5HX9jixc6IEUNh3Rka5Ph7NmuLi0yL0s3ClwujayiRKwzE5jPmtWasyCwmyYN2Wt9B7mH3OF02xGzlmypQUiv6RLejZpxH+v612trWQK8+cWcVsDTmfeeZ1y8pcKe60J5p3AXwAqRD2/HCiYDfyTOmTdd88+zOQNS6zGmFj38X6nNtd71S9NzeVdg/qm2He9Yl0aHNAuB3tbW1rFFJOw8eKS2MxSORJzObSyRSCwWCYdMap24gcaEXOdbsfQG5p+3IwN8lsZ0Y1miy9QbITS2LGcDgedIh/E0uk5Ddl7ZKoryGdKfK0mXBqQdBP/WlL3QjtTzreWiXHjaAZrsMk9JWsrVQ2hc2lTnNCY94LWbOnMLgbGKPW1VTKnPHSUG02Kmdb/0Bp5rTe1aV0CiWx/WTbhqhiONA6ABZTNj+/Yx41r4bVZnMulexKc1d5z9Vfa3z58vzGcyyt6yDxjLLOpQ6z8kuwtpPYTGdbVGb9CpTR3a58pKuoWs2tyhNbTj0KM1mU1aw0E4vaHTbNZh625vh4/RdphQ59nswnzJECC1aszSdcfHJ1ydQNnn8/MZZbn2xiBnIKQjUVWQri6NQW0ydXR0dKq1Wp1Wq+7o7DCZOrX6s/ulS6PvQKhjcT6jIPqc1xqks9PjEhpXA61QoVXqbj5rMKvby3dYazZ36g0G/d7eXk6QPa3OYNAZdDqtGkjNREy6dk1Xl/g+vdqszWXnFa0ZpMlJpsRjEho3XMA0WvIcoNOZ+ZyBtaYzIWTuAqPLKMZ6W/eLeNsqYdnkQCCzsJjda9fiU6YdPGxXu9qUe57pDXxf9wNOa0nSm+KDyvzzc0ik02u1Wn12PrM/sNYkvWPwYQvZpzotNnT1JDwj2XDq8QiNy1ozNiPXwvM9MzLzhchZDZTOOXAi5UGtHZc0MJlDOi0Qtn4nEeAxCdOmrrMatTa3AMWk4HN6oFvIVDHJekWxkJuAn1mpGuNjERrXkQGXyRq9rqNL047j/tmFTFWz7B1TgN0tPoVQ8/RpNru4ODU1sbCwMDmPJZPJBMhtyw45LlPze2atVNH0OITGoYXMwlNdJ7ZNte4p2GXgwC7yZNmcDiGTTq+B4EHKNly36SG4QjQVQimOLqbOPYCfmAD2ianFbDa7MKnAHzKqhZDT8AVPdRC27OJ/r8RFcqdh9ADcWMC1kN0zIZNW6IdqEMBvJ+B6PS5c9TqUmxxrHdWchXpJGsDjEBrXxRKmVwn53VWuuQC0UaAdQxka1p5eR3I+fOOkryMgmKSLSFVmjU632KlGuYXvTnytL+PQdxXmOCUoUTm/sIfMOJuJammHmg4qGe0eWF1GEOJ/+IaAi2CN2Du1atgGyLFAosEP4VioIfl06XbnwbcVEmXEYxCudi2WtxHKSSjVFrJi80qOv15r0u3lFhdcmYDyqLwIuV+pCBTx8a0tlZAVFw0d6Cp5/cTvrQ6Zol1r1mUXMoKxTiJzp2iWUINCfsxBAd1wUhzLZPmq8JkkgLUTGufUQnrXmrRP53EUDXUJcJ3IsLggQcIXREEIexelKU1rJ9zMqdU6Pkp2abTIDE5mMoD7qHNFrR4u/K1UayQMKHAxb0YnuxKWcegfrUrobrM5tUmn4UcvtCZwOEXV/Ya0GAjMzy9MZSGoQATV60Bwq8Fnf8j9xPMC5B6s5LYzZeYdgM4E6lOtNKGmZsJVYQd6ldAQnEUQXzRdZsUBNKGUyRlwaNQa9EJiEHoPPv3j3K/T4rwPraMYTDsNudzTRQBXtioQH7ckWSaqdiudqtSRAsKoybxbzqacn4ROyqzWGcqbvtoFZ3/IM+bclA47d4epUwrAWgmNGwfHjVp7M1N8SiAJvxMJ5lteroCqOksZD6QTf+FeWC8Ovx3I/l2gfC2E7N4JSUJNrYTrJKAoFPuq5fPQJT7PmpC6vatE1m5Qm1FHe253cQEcNZMRHE5M/hmXaxIccRFy/67Q/hsgDyGz1sDrHrn4evcfJ0mYVkOaUOug9FLvLU65SsMYi2Yo1YQqDRI+VNOG3OIk7hVri5ylW1YrM/MTizk1fAIS3ipNn18boXFISyD4arMdGoc9sCKyh9ouPiWaAH1yvtrYxfEESJ+JQU2S+Ys1Ei4b9ocFvVlHxvFdal2HDiy4rtGL6jLB8wXmJWmgarTSb3V8fuiqhNybVJ4fnX8hXNlt00t3Un8hYO8kOY9hMGslaaBqI0z/AwInbmzP6aB57dTq9O3CCSfTwmS1vRzDd4CfXFiEd0Dg4cMoiaiQ9vWas3u5HM78i7jrx+vy4+xfzPiK0Wx7hxaX8xIRvnX0RsY5MbXD8ccNgGthMddhIiOker4TEF5WQrsBBQF08HAcIN+LyeCAaPjOH3e/ZATVhAcUz5JhSBcSTihqJKnb3mp582glGm9VU1Mm24GHrzWjItoiVDLmTl3tHf7BnK/XdZi0anLkTIbsggTB9MybLeePJkxPVPcYxSLSQILG+V5tgqxRQiNKAg1pO9AhYsZ9v05s+jXlSd/UpUcdi5mx1l4J5tqcOd/S+sZRiMaNg/WnyJiFrhEZ2ov9vUZPvM5wNpddnMDlNa6tlUohyvABR4mHuwOk8QVHnMKpP7un0WFHJRWfaW9BSLi3Gr/O+Y3WltbWo+zUuJrFp8ECVXNdxqA28QamNUHagC1dmXraYAEJr8wAAAB0SURBVOLgOJplc6h4QCcaBnyzFROCFl/M+C22N6gWc4vP5wOKsfOVuzZvgm5xL/scn6s4Nlg1Vpc4yKXMNla3nQEN8oSt53/81plDxbikLrpXuw4MCYe8chbFrlLCMW+o1ojbn89ApzJ0+G4dLW/9mOji/wD5l0RuTt0YggAAAABJRU5ErkJggg==" />
      </Head>
      {/* <div className="flex h-screen flex-col lg:grid lg:grid-cols-10"> */}
      <Toaster position="bottom-center" />
        <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
            
            <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                <div className="bg-gradient-to-br rounded-xl from-yellow-400 to-purple-600 p-2">
                    <img src={urlFor(collection.previewImage).url()}  className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" alt="" />
                </div>
<div className="space-y-2 p-5 text-center">
    <h1 className="text-4xl font-bold text-white">{collection.nftCollectionName}</h1>
    <h2 className="text-xl text-gray-300">{collection.description}</h2>
</div> 
            </div>
        </div>
        {/* </div> */}
        <div className="flex flex-1 flex-col p-12 lg:col-span-6">
            <header className="flex items-center justify-between">
                <Link href="/">
                <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">The{' '}
                <span className="font-extrabold underline decoration-pink-600/50">
                    PAPAFAM
                </span>{" "}
                NFT Market Place
                </h1>
                </Link>
                <button onClick={()=>(address ? disconnect() : connectWithMetamask())} className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base">
                    {address? "Sign Out":"Sign In"}
                </button>
            </header>
            <hr className="my-2 border" />
            {address && (
<p className="text-center text-sm text-rose-400">You're logged in with wallet {address.substring(0,5)}...{address.substring(address.length-4)}</p>
            )}
            <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:spce-y-0 lg:justify-center">
                <img src={urlFor(collection.mainImage).url()} className="w-80 object-cover pb-10 lg:h-40" alt="" />
                <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">{collection.title}</h1>
                {loading ? (
  <p className="pt-2 text-xl text-green-500 animate-pulse">Loading Supply Count</p>
                ):(
                    <p className="pt-2 text-xl text-green-500">{claimedSupply} / {totalSupply?.toString()} NFT's claimed</p>
                )}
              {loading && (
                  <img src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif" className="h-80 w-80 object-contain" alt="" />
              )}
            </div>
            <button onClick={mintNFT} disabled={!address || loading || claimedSupply == totalSupply?.toNumber()} className="mt-10 h-16 w-full rounded-full bg-red-600 text-white font-bold disabled:bg-gray-400"> 
             {loading ? (
                 <>Loading....</>
             ):claimedSupply == totalSupply?.toNumber()?(
                 <>Sold Out</>
             ):!address ? (
                 <>Sign In to Mint</>
             ):(
                 <span className="font-bold"> Mint NFT ({priceInEth} ETH)</span>
             )}
            </button>
        </div>
    </div>

  )
}

export default NFTDropPage

export const getServerSideProps:GetServerSideProps = async ({params}) =>{
const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage{
    asset
  },
  previewImage{
    asset
  },slug{
    current
  },
  creator->{
    _id,
    name,
    address,
    slug{
    current
  },
  },
  }`
  const collection = await sanityClient.fetch(query,{
      id:params?.id
  })
  if(!collection){
      return{
          notFound:true
      }
  }
  return{
      props:{ collection}
  }
}